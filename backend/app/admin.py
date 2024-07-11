from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Task, Department

User = get_user_model()

admin.site.register(Department)
admin.site.register(User)
