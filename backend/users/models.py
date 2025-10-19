from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    # Store avatar as URL (uploads handled via presigned S3 or third-party)
    avatar_url = models.URLField(blank=True, null=True)

    # Phone numbers stored in E.164
    primary_contact = models.CharField(max_length=32, blank=True, null=True)
    secondary_contact = models.CharField(max_length=32, blank=True, null=True)

    # Additional flexible profile data
    profile_json = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.get_full_name() or self.username
