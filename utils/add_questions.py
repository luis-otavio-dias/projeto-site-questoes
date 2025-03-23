import os
import sys

# from datetime import datetime
from pathlib import Path

# from random import choice
import csv

import django
from django.conf import settings

DJANGO_BASE_DIR = Path(__file__).parent.parent
# NUMBER_OF_OBJECTS = 1000

sys.path.append(str(DJANGO_BASE_DIR))
os.environ["DJANGO_SETTINGS_MODULE"] = "project.settings"
settings.USE_TZ = False


# import django
# from django.conf import settings


CSV_FILE = Path(__file__).parent / "questoes_socio.csv"

# django.setup()

# Edition.objects.all().delete()
# Theme.objects.all().delete()
# Question.objects.all().delete()
# Answer.objects.all().delete()


# question_dict = defaultdict(list)
# options_dict = defaultdict(list)

# Unpacking data from csv file
django.setup()

if __name__ == "__main__":
    from question.models import Question, Theme, Edition, Answer

    with open(CSV_FILE, newline="", encoding="utf-8") as file:
        reader = csv.reader(file, delimiter=";")
        next(reader)
        rows_len = 0
        idx = 0

        for row in reader:
            # theme_ = row[1].strip()
            theme = Theme.objects.create(name=row[1])

            edition = Edition.objects.create(year=row[0])

            question_ = Question.objects.create(
                stem=row[2],
                correct_answer=row[4],
                theme=theme,
                edition=edition,
            )

            # question_dict["editions"].append(row[0])

            # question_dict["themes"].append(row[1].strip())

            # question_dict["stem"].append(row[2].strip())

            # question_dict["correct"].append(row[4].strip())

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


# questao = []
# django_question = []
# django_themes = [Theme(name=name) for name in addQuestion["themes"]]
# django_editions = [Edition(year=year) for year in addQuestion["editions"]]
# i = 0
# django_question.append(theme for theme in addQuestion["themes"])
# django_question = [print(theme) for theme in addQuestion["themes"]]

# print(addQuestion["editions"])

# for theme in django_themes:
#     theme.save()

# for edition in django_editions:
#     edition.save()

# django_contacts = []

# for _ in range(NUMBER_OF_OBJECTS):
#     profile = fake.profile()
#     email = profile["mail"]
#     first_name, last_name = profile["name"].split(" ", 1)
#     phone = fake.phone_number()
#     created_date: datetime = fake.date_this_year()
#     description = fake.text(max_nb_chars=100)
#     category = choice(django_categories)

#     django_contacts.append(
#         Contact(
#             first_name=first_name,
#             last_name=last_name,
#             phone=phone,
#             email=email,
#             created_date=created_date,
#             description=description,
#             category=category,
#         )
#     )

# if len(django_contacts) > 0:
#     Contact.objects.bulk_create(django_contacts)
