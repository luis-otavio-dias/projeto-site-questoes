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

CSV_FILE = Path(__file__).parent / "questoes_socio.csv"

django.setup()

if __name__ == "__main__":
    from question.models import Question, Theme, Edition, Answer

    with open(CSV_FILE, newline="", encoding="utf-8") as file:
        reader = csv.reader(file, delimiter=";")
        next(reader)
        rows_len = 0
        idx = 0

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

            rows_len += 1
