from django.conf import settings
from pathlib import Path
import django
import sys
import csv
import os


DJANGO_BASE_DIR = Path(__file__).parent.parent

sys.path.append(str(DJANGO_BASE_DIR))
os.environ["DJANGO_SETTINGS_MODULE"] = "project.settings"
settings.USE_TZ = False

file_name = "questoes_socio.csv"
CSV_FILE = Path(__file__).parent / file_name


def add_question_csv(csv_file):
    from project.apps.question.models import Question, Theme, Edition, Answer

    django.setup()

    with open(csv_file, newline="", encoding="utf-8") as file:
        reader = csv.reader(file, delimiter=";")
        next(reader)

        for row in reader:
            theme = Theme.objects.create(name=row[1])

            edition = Edition.objects.create(year=row[0])

            question_ = Question.objects.create(
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

    from project.apps.question.models import Question, Theme, Edition, Answer

    django.setup()

    with open(CSV_FILE, newline="", encoding="utf-8") as file:
        reader = csv.reader(file, delimiter=";")
        next(reader)

        for row in reader:
            theme = Theme.objects.create(name=row[1])

            edition = Edition.objects.create(year=row[0])

            question_ = Question.objects.create(
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
