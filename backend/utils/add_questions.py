import csv
import os
import sys
from pathlib import Path

import django

BASE = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()

from django.db import transaction  # noqa: E402

from apps.question.models import Answer, Edition, Question, Theme  # noqa: E402
from apps.user.models import User  # noqa: E402


@transaction.atomic
def add_question_csv(csv_file: Path | str, user: User | None) -> None:
    path = Path(csv_file)

    with path.open(newline="", encoding="utf-8") as file:
        reader = csv.reader(file, delimiter=";")
        next(reader, None)

        for row in reader:
            theme, created_theme = Theme.objects.get_or_create(name=row[1])

            edition, created_edt = Edition.objects.get_or_create(year=row[0])

            question_ = Question.objects.create(
                user=user,
                stem=row[2],
                correct_answer=row[4],
                theme=theme,
                edition=edition,
            )

            options_s = row[3]
            options = options_s.split("|")

            for op in options:
                op = op.strip()
                option, text = op.split(") ", 1)

                Answer.objects.create(
                    question=question_,
                    option=option,
                    option_text=text,
                )


if __name__ == "__main__":
    # If this file is run directly, it will read data from a CSV file
    # specified by the CSV_FILE variable and add the data to the platform.
    # The CSV file must be located in the 'utils/' directory; otherwise,
    # please update the CSV_FILE variable with the correct path.
    file_name = "questoes_socio.csv"
    csv_file = Path(__file__).parent / file_name

    add_question_csv(csv_file, None)
