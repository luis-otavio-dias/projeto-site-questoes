import base64
from unittest.mock import patch

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.question.models import Exam, ExamExtractionTask, Question
from apps.question.services import (
    ExtractionPipelineError,
    process_exam_import,
)
from apps.user.models import User

DUMMY_PNG_B64 = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk"
    "+A8AAQUBAScY42YAAAAASUVORK5CYII="
)


@pytest.fixture
def test_user(db):
    """Fixture to create a standard user for exam ownership."""
    return User.objects.create_user(
        email="professor@teste.com",
        password="secretpassword123",
    )


@pytest.fixture
def mock_pipeline_success_payload():
    """Valid payload matching ProcessingResponseContract schema."""
    return {
        "status": "success",
        "error_message": None,
        "data": {
            "metadata": {
                "exam_name_base": "ENEM",
                "exam_name_sigle": "ENEM 2024",
                "exam_variant": "Caderno 1 Azul",
                "exam_year": 2024,
                "exam_style": "MULTIPLE_CHOICE",
                "exam_type": "PROVA",
                "answer_key_location": "FINAL",
                "total_questions": 2,
            },
            "questions": [
                {
                    "question_id": "Q1",
                    "question": "Questão 1",
                    "passage_text": "Texto de apoio da questão 1.",
                    "sources": ["Manual do Candidato, 2024"],
                    "image": True,
                    "images": [
                        {
                            "filename": "diagrama_q1.png",
                            "content_base64": DUMMY_PNG_B64,
                            "mime_type": "image/png",
                        }
                    ],
                    "statement": "Qual é a capital da França?",
                    "options": [
                        {"label": "A", "text": "Londres"},
                        {"label": "B", "text": "Berlim"},
                        {"label": "C", "text": "Paris"},
                        {"label": "D", "text": "Madri"},
                        {"label": "E", "text": "Lisboa"},
                    ],
                    "correct_option": "C",
                    "metadata": {
                        "area": "Ciências Humanas",
                        "topic": "Geografia Política",
                        "language": None,
                    },
                },
                {
                    "question_id": "Q2",
                    "question": "Questão 2",
                    "passage_text": "",
                    "sources": [],
                    "image": False,
                    "images": [],
                    "statement": "Quanto é 2 + 2?",
                    "options": [
                        {"label": "A", "text": "3"},
                        {"label": "B", "text": "4"},
                        {"label": "C", "text": "5"},
                        {"label": "D", "text": "6"},
                        {"label": "E", "text": "7"},
                    ],
                    "correct_option": "B",
                    "metadata": {
                        "area": "Matemática",
                        "topic": "Aritmética Básica",
                        "language": None,
                    },
                },
            ],
        },
    }


@pytest.mark.django_db
class TestProcessExamImport:
    """Test suite covering the process_exam_import pipeline."""

    def test_process_exam_import_success(
        self,
        test_user,
        mock_pipeline_success_payload,
        tmp_path,
        settings,
    ):
        settings.MEDIA_ROOT = tmp_path

        with patch("apps.question.signals.trigger_ai_processing"):
            fake_pdf = SimpleUploadedFile(
                "prova_enem.pdf",
                b"%PDF-1.4 dummy pdf binary stream",
                content_type="application/pdf",
            )
            task = ExamExtractionTask.objects.create(
                user=test_user,
                title="Extração ENEM 2024",
                exam_file=fake_pdf,
                status="PENDING",
            )

        with patch(
            "apps.question.services.exam_pipeline_api",
            return_value=mock_pipeline_success_payload,
        ) as mock_api:
            process_exam_import(task)

        task.refresh_from_db()
        mock_api.assert_called_once_with(task)

        assert task.status == "COMPLETED"
        assert task.raw_json_output == mock_pipeline_success_payload

        assert task.generated_exam is not None
        assert Exam.objects.filter(pk=task.generated_exam.id).exists()

        exam = task.generated_exam
        assert exam.user == test_user
        assert exam.name_base == "ENEM"
        assert exam.name_sigle == "ENEM 2024"
        assert exam.variant == "Caderno 1 Azul"
        assert str(exam.year) == "2024"
        assert exam.style == "MULTIPLE_CHOICE"

        assert exam.questions.count() == 2
        assert Question.objects.filter(exam=exam).count() == 2

        q1 = exam.questions.get(question_id="Q1")
        assert q1.correct_answer == "C"
        assert q1.options == [
            {"label": "A", "text": "Londres"},
            {"label": "B", "text": "Berlim"},
            {"label": "C", "text": "Paris"},
            {"label": "D", "text": "Madri"},
            {"label": "E", "text": "Lisboa"},
        ]
        assert q1.stem == "Qual é a capital da França?"
        assert q1.name == "Questão 1"
        assert q1.passage_text == "Texto de apoio da questão 1."
        assert q1.sources == ["Manual do Candidato, 2024"]
        assert q1.area == "Ciências Humanas"
        assert q1.topic == "Geografia Política"
        assert q1.has_image is True

        assert q1.images.count() == 1
        img1 = q1.images.first()
        assert img1 is not None
        assert img1.filename == "diagrama_q1.png"
        assert img1.mime_type == "image/png"
        assert img1.image.read() == base64.b64decode(DUMMY_PNG_B64)

        q2 = exam.questions.get(question_id="Q2")
        assert q2.correct_answer == "B"
        assert q2.stem == "Quanto é 2 + 2?"
        assert q2.name == "Questão 2"
        assert q2.passage_text == ""
        assert q2.sources == []
        assert q2.area == "Matemática"
        assert q2.topic == "Aritmética Básica"
        assert q2.has_image is False
        assert len(q2.options) == 5
        assert q2.options[1] == {"label": "B", "text": "4"}
        assert q2.images.count() == 0

    def test_process_exam_import_api_error_marks_task_failed(
        self,
        test_user,
        tmp_path,
        settings,
    ):
        """
        When exam_pipeline_api raises ExtractionPipelineError, task is marked
        FAILED.
        """
        settings.MEDIA_ROOT = tmp_path

        with patch("apps.question.signals.trigger_ai_processing"):
            fake_pdf = SimpleUploadedFile(
                "prova.pdf",
                b"dummy pdf content",
                content_type="application/pdf",
            )
            task = ExamExtractionTask.objects.create(
                user=test_user,
                exam_file=fake_pdf,
                status="PENDING",
            )

        with patch(
            "apps.question.services.exam_pipeline_api",
            side_effect=ExtractionPipelineError(
                "Serviço FastAPI indisponível"
            ),
        ):
            process_exam_import(task)

        task.refresh_from_db()
        assert task.status == "FAILED"
        assert task.generated_exam is None
        assert Exam.objects.filter(user=test_user).count() == 0

    def test_process_exam_import_empty_data_marks_task_failed(
        self,
        test_user,
        tmp_path,
        settings,
    ):
        """
        When API returns valid status but empty data payload,
        task is marked FAILED.
        """
        settings.MEDIA_ROOT = tmp_path

        with patch("apps.question.signals.trigger_ai_processing"):
            fake_pdf = SimpleUploadedFile(
                "prova.pdf",
                b"dummy pdf content",
                content_type="application/pdf",
            )
            task = ExamExtractionTask.objects.create(
                user=test_user,
                exam_file=fake_pdf,
                status="PENDING",
            )

        empty_payload = {
            "status": "success",
            "data": None,
            "error_message": "Nenhuma questão encontrada",
        }

        with patch(
            "apps.question.services.exam_pipeline_api",
            return_value=empty_payload,
        ):
            process_exam_import(task)

        # ASSERT
        task.refresh_from_db()
        assert task.status == "FAILED"
        assert task.generated_exam is None
        assert Exam.objects.filter(user=test_user).count() == 0


class TestProcessExamImportRollbackOnQuestionError:
    """
    Test the rollback behavior of process_exam_import when a question error
    occurs.
    """

    def test_process_exam_import_rollback_on_question_error(
        self,
        test_user,
        mock_pipeline_success_payload,
        tmp_path,
        settings,
    ):
        """
        When a question error occurs during exam import,
        the task is marked FAILED and no exam is generated.
        """
        settings.MEDIA_ROOT = tmp_path

        with patch("apps.question.signals.trigger_ai_processing"):
            task = ExamExtractionTask.objects.create(
                user=test_user,
                exam_file=SimpleUploadedFile(
                    "prova.pdf",
                    b"pdf",
                    content_type="application/pdf",
                ),
                status="PENDING",
            )

        original_create = Question.objects.create

        def mock_question_create(**kwargs):
            if kwargs.get("question_id") == "Q2":
                from django.db import IntegrityError

                raise IntegrityError("Simulated DB error on Q2")
            return original_create(**kwargs)

        with (
            patch(
                "apps.question.services.exam_pipeline_api",
                return_value=mock_pipeline_success_payload,
            ),
            patch(
                "apps.question.models.Question.objects.create",
                side_effect=mock_question_create,
            ),
        ):
            process_exam_import(task)

        # ASSERT
        task.refresh_from_db()
        assert task.status == "FAILED"
        assert task.generated_exam is None
        assert Exam.objects.count() == 0
        assert Question.objects.count() == 0
