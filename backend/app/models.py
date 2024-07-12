import random

from django.contrib.auth.models import AbstractUser, Permission, Group
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)



class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = _('department')
        verbose_name_plural = _('departments')

    def __str__(self):
        return self.name
    

class CustomUser(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    
    # Generate 6-digit random ID
    id = models.IntegerField(default=random.randint(100000, 999999), unique=True, primary_key=True, editable=False)
    pfp = models.TextField(default='https://i.ibb.co/R932cKN/logo.png')
    initials = models.CharField(max_length=3, default='')
    department = models.ManyToManyField(Department, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    groups = models.ManyToManyField(
        Group,
        related_name='custom_users',
        blank=True,
        help_text=_('The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        related_query_name='custom_user',
        verbose_name=_('groups'),
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_users',
        related_query_name='custom_user',
        blank=True,
        verbose_name=_('user permissions'),
        help_text=_('Specific permissions for this user.'),
    )    
    
class Task(models.Model):
    assigned_users = models.ManyToManyField(
        CustomUser,
        related_name='tasks_assigned',
        verbose_name=_('assigned users'),
    )
    created_user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='tasks_created',
        verbose_name=_('created user'),
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='tasks',
        verbose_name=_('department'),
    )
    task_title = models.CharField(max_length=500)
    task_description = models.TextField()
    task_due_date = models.DateTimeField()
    task_status = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)

    class Meta:
        verbose_name = _('task')
        verbose_name_plural = _('tasks')