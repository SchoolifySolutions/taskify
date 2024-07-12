from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework import viewsets, permissions, status
from django.contrib.auth import get_user_model, authenticate, login, logout
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import update_session_auth_hash
from .serializers import ChangePasswordSerializer, TaskSerializer, DepartmentSerializer, UserSerializer
from .models import CustomUser, Task, Department
from django.core import serializers  
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

User = get_user_model()

class LoginView(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)

            # Serialize department data as a list of department names
            departments = list(user.department.all().values_list('name', flat=True))
            groups = list(user.groups.all().values_list('name', flat=True))


            return Response({
                'Email': username,
                'Id': user.id,
                'Departments': departments,
                'Username': user.username,
                'Initials': user.initials,
                'First Name': user.first_name,
                'Last Name': user.last_name,
                'Groups': groups,
                'Token': token.key
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method == 'POST':
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data.get('old_password')):
                user.set_password(serializer.data.get('new_password'))
                user.save()
                update_session_auth_hash(request, user)
                return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Incorrect old password.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'})


@api_view(['POST'])
def get_department_tasks(request):
    try:
        email = request.data.get('email')
        user = CustomUser.objects.get(email=email)
        departments = user.department.all()
        tasks = Task.objects.filter(department__in=departments)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except CustomUser.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def get_dept_by_id(request):
    try:
        dept_id = request.data.get('department_id')
        department = Department.objects.get(id=dept_id)
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)

    except CustomUser.DoesNotExist:
        return Response({'error': 'Department does not exist.'}, status=404)
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=500)
    
@api_view(['POST'])
def get_user_by_id(request):
    try:
        print(request.data)
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    except CustomUser.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=404)
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=500)
    
    
@api_view(['POST'])
def change_task_status(request):
    if request.method == 'POST':
        task_id = request.data.get('task_id')
        task_status = request.data.get('task_status')
        task = Task.objects.get(id=task_id)
        task_num = 0
        if task_status.lower() == 'todo':
            task_num = 0
        elif task_status.lower() == 'in progress':
            task_num = 1
        elif task_status.lower() == 'done':
            task_num = 2
        elif task_status.lower() == 'stuck':
            task_num = 3
        elif task_status.lower() == 'canceled':
            task_num = 4

        task.status = task_status

        return Response('Success', status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'})

@api_view(['POST'])
def delete_task(request):
    if request.method == 'POST':
        try:
            task_id = request.data.get('task_id')
            task = Task.objects.get(id=task_id)
            task.delete()
            return Response('Task successfully deleted', status=status.HTTP_200_OK)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
@api_view(['POST'])
def edit_task(request):
    task_id = request.data.get('task_id')
    if not task_id:
        return Response({'error': 'Task ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    if request.user is created_user:
        task = get_object_or_404(Task, id=task_id)

        assigned_users = request.data.get('assigned_users')
        task_title = request.data.get('task_title')
        task_description = request.data.get('task_description')
        created_user = request.data.get('created_user')
        department = request.data.get('department')
        task_due_date = request.data.get('task_due_date')
        task_status = request.data.get('task_status')
        priority = request.data.get('priority')

        try:
            if assigned_users is not None:
                task.assigned_users.set(assigned_users)

            if task_title is not None:
                task.task_title = task_title

            if task_description is not None:
                task.task_description = task_description

            if created_user is not None:
                task.created_user = created_user  # Ensure to handle user validation if needed

            if department is not None:
                task.department_id = department  # Assuming department is passed as ID

            if task_due_date is not None:
                task.task_due_date = task_due_date

            if task_status is not None:
                task.task_status = task_status

            if priority is not None:
                task.priority = priority

            task.save()
            return Response({'success': 'Task updated successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
   
@api_view(['POST'])
def your_tasks(request):
    try:
        email = request.data.get('email')
        user = User.objects.get(email=email)
        tasks = Task.objects.filter(assigned_users=user)
        tasks_serializer = TaskSerializer(tasks, many=True)
        return Response(tasks_serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)