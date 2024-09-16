from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User , on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title

class Counter(models.Model):
    count = models.IntegerField(default=0) 

    def __str__(self):
        return f"{self.id}: {self.count}"

    def increment(self):
        """Increment the counter by 1."""
        self.count += 1
        self.save()

    def decrement(self):
        """decrement the counter by 1."""
        self.count -= 1
        self.save()

    def reset(self):
        """Reset the counter to zero."""
        self.count = 0
        self.save()
       