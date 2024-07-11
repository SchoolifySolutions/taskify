from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Task, Department
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    assigned_users = UserSerializer(many=True)
    created_user = UserSerializer()
    department = DepartmentSerializer()

    class Meta:
        model = Task
        fields = ('id', 'assigned_users', 'department','created_user', 'department', 'task_title', 'task_description', 'task_due_date', 'task_status', 'priority')



class ResetPasswordEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)