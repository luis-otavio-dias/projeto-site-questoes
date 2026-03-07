from dataclasses import dataclass


@dataclass(slots=True)
class QuestionImageDTO:
    filename: str
    content_base64: str
    mime_type: str


@dataclass(slots=True)
class QuestionImportDTO:
    area: str
    topic: str
    question_id: str
    name: str
    stem: str
    passage_text: str
    correct_answer: str
    has_image: bool
    options: list[dict]  # {"label": str, "text": str}
    images: list[QuestionImageDTO]
    sources: list[str]


@dataclass(slots=True)
class ExamImportDTO:
    name_base: str
    name_sigle: str
    variant: str
    year: int
    style: str
    questions: list[QuestionImportDTO]
