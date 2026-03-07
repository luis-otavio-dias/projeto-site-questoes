from pydantic import BaseModel, Field


class OptionContract(BaseModel):
    label: str = Field(..., pattern=r"^[A-E]$")
    text: str


class QuestionImageContract(BaseModel):
    filename: str
    content_base64: str
    mime_type: str


class QuestionMetadataContract(BaseModel):
    area: str | None = None
    topic: str | None = None


class QuestionContract(BaseModel):
    question_id: str
    question: str
    passage_text: str
    sources: list[str]
    image: bool
    images: list[QuestionImageContract]
    statement: str
    options: list[OptionContract]
    correct_option: str = Field(..., pattern=r"^[A-E]$")
    metadata: QuestionMetadataContract


class ExamMetadataContract(BaseModel):
    exam_name_base: str
    exam_name_sigle: str
    exam_variant: str
    exam_year: int
    exam_style: str
    exam_type: str
    answer_key_location: str
    total_questions: int


class ExamContract(BaseModel):
    metadata: ExamMetadataContract
    questions: list[QuestionContract]


class ProcessingResponseContract(BaseModel):
    status: str
    data: ExamContract | None = None
    error_message: str | None = None
