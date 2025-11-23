import magic
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile


def validate_file_type(file: UploadedFile) -> None:
    file.seek(0)

    accepted = ["text/csv", "text/plain", "application/pdf"]
    sample = file.read(2048)
    file_mime_type = magic.from_buffer(sample, mime=True)

    file.seek(0)

    if file_mime_type in accepted:
        if file_mime_type == "text/plain":
            head = sample.decode(errors="ignore")
            if ("," not in head) and (";" not in head) and ("\t" not in head):
                msg = "Invalid CSV file format."
                raise ValidationError(msg)
        return

    print(file_mime_type)
    msg = "Invalid file type. Accepted types: PDF or CSV."
    raise ValidationError(msg)
