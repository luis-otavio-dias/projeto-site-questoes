from django.db import models
from django.utils.timezone import now


# Create your models here.
class ChatMessage(models.Model):
    user_message = models.CharField(max_length=500)
    bot_message = models.CharField(max_length=2000)
    timestamp = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.timestamp.strftime('%H:%M')} {self.user_message}"
