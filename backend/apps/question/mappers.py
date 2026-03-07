from apps.question.api_contract import ExamContract
from apps.question.dto import (
    ExamImportDTO,
    QuestionImageDTO,
    QuestionImportDTO,
)


def map_exam_contract_to_dto(
    contract: ExamContract,
) -> ExamImportDTO:

    exam_year = contract.metadata.exam_year

    question_dtos = []

    for question in contract.questions:
        dto = QuestionImportDTO(
            question_id=question.question_id,
            name=question.question,
            stem=question.statement,
            passage_text=question.passage_text,
            correct_answer=question.correct_option,
            has_image=question.image,
            area=question.metadata.area,
            topic=question.metadata.topic,
            sources=list(question.sources),
            options=[
                {"label": opt.label, "text": opt.text}
                for opt in question.options
            ],
            images=[
                QuestionImageDTO(
                    filename=img.filename,
                    content_base64=img.content_base64,
                    mime_type=img.mime_type,
                )
                for img in question.images
            ],
        )

        question_dtos.append(dto)

    return ExamImportDTO(
        name_base=contract.metadata.exam_name_base,
        name_sigle=contract.metadata.exam_name_sigle,
        variant=contract.metadata.exam_variant,
        year=exam_year,
        style=contract.metadata.exam_style,
        questions=question_dtos,
    )
