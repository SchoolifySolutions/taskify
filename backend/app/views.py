from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from pymongo import MongoClient
from bson.objectid import ObjectId
from rest_framework import viewsets, permissions, status
from django.contrib.auth import get_user_model, authenticate, login, logout
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import update_session_auth_hash
from .serializers import ChangePasswordSerializer, TaskSerializer, DepartmentSerializer, UserSerializer
from .models import CustomUser, Task, Department
from django.shortcuts import get_object_or_404

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
            # Generate tokens
            refresh = RefreshToken.for_user(user)

            # Serialize department data
            departments = list(user.department.all().values_list('name', flat=True))
            team_lead = list(user.team_lead.all().values_list('name', flat=True))
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
                'Teamlead': team_lead,
                'access_token': str(refresh.access_token),
                'refresh': str(refresh),
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def change_password(request):
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
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_dept_by_id(request):
    try:
        dept_id = request.data.get('department_id')
        department = Department.objects.get(id=dept_id)
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)
    except Department.DoesNotExist:
        return Response({'error': 'Department does not exist.'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_task_by_id(request):
    try:
        print(request.data)
        task_id = request.data.get('task_id')
        task = Task.objects.get(id=task_id)
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    except Department.DoesNotExist:
        return Response({'error': 'Department does not exist.'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request):
    try:
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_task_status(request):
    task_id = request.data.get('task_id')
    task_status = request.data.get('task_status')
    task = get_object_or_404(Task, id=task_id)

    task_num = {'todo': 0, 'in progress': 1, 'done': 2, 'stuck': 3, 'canceled': 4}.get(task_status.lower())

    if task_num is not None:
        task.task_status = task_num
        task.save()
        return Response('Success', status=status.HTTP_200_OK)
    return Response({'error': 'Invalid task status'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_task(request):
    task_id = request.data.get('task_id')
    if not task_id:
        return Response({'error': 'Task ID is required'}, status=status.HTTP_400_BAD_REQUEST)

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
            task.created_user = created_user
        if department is not None:
            task.department_id = department
        if task_due_date is not None:
            task.task_due_date = task_due_date
        if task_status is not None:
            task.task_status = task_status
        if priority is not None:
            task.priority = priority

        task.save()
        return Response({'success': 'Task updated successfully'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def your_tasks(request):
    email = request.GET.get('email')
    if not email:
        return Response({'error': 'Email parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        tasks = Task.objects.filter(assigned_users=user)
        tasks_serializer = TaskSerializer(tasks, many=True)
        return Response(tasks_serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_tasks(request):
    try:
        email = request.data.get('email')
        user = User.objects.get(email=email)
        tasks = Task.objects.filter(created_user=user)
        tasks_serializer = TaskSerializer(tasks, many=True)
        return Response(tasks_serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def get_users_by_dept(request):
    try:
        department = request.data.get('department')
        department_instance = get_object_or_404(Department, name=department)
        users = User.objects.filter(department=department_instance)
        users_list = [{'value': user.id, 'label': user.username} for user in users]
        return Response(users_list, status=status.HTTP_200_OK)
    except Department.DoesNotExist:
        return Response({'error': 'Department does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def new_tasks(request):
    try:
        # Extracting data from the request
        department_name = request.data.get('department')
        task_title = request.data.get('task_title')
        task_description = request.data.get('task_description')
        task_due_date = request.data.get('task_due_date')
        priority = request.data.get('priority')
        created_user_id = request.data.get('created_user')
        assigned_user_ids = request.data.get('assigned_users', [])

        # Validate required fields
        if not all([department_name, task_title, task_description, task_due_date, created_user_id]):
            return Response({'error': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the department and created user instances
        department_instance = get_object_or_404(Department, name=department_name)
        created_user = get_object_or_404(CustomUser, id=created_user_id)

        # Create the task
        task = Task.objects.create(
            created_user=created_user,
            department=department_instance,
            task_title=task_title,
            task_description=task_description,
            task_due_date=task_due_date,
            priority=priority,
        )

        # Fetch assigned users and set them
        if assigned_user_ids:
            assigned_users = CustomUser.objects.filter(id__in=[user['value'] for user in assigned_user_ids])
            task.assigned_users.set(assigned_users)

        # Return success response
        return Response({'success': 'Task created successfully.'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_task_priority(request):
    task_id = request.data.get('task_id')
    task_priority = request.data.get('task_priority')
    task = get_object_or_404(Task, id=task_id)

    task_num = {'low': 0, 'medium': 1, 'high': 2}.get(task_priority.lower())

    if task_num is not None:
        task.priority = task_num
        task.save()
        return Response('Success', status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid task status'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_team_by_dept(request):
    try:
        departments = request.data.get('departments')
        if not departments:
            return Response({'error': 'No departments provided.'}, status=400)

        final_dict = {}
        for dept_name in departments:
            try:
                dept = Department.objects.get(name=dept_name)
                team_leads = CustomUser.objects.filter(display_team_lead=dept)
                
                members = CustomUser.objects.filter(groups=1, department=dept)

                final_dict[dept.name] = {
                    "team_lead": list(team_leads.values()),
                    "members": list(members.values())
                }
            except Department.DoesNotExist:
                return Response({'error': f'Department {dept_name} does not exist.'}, status=404)

        return Response({'departments': final_dict})
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=500)
# 1 Is Member
# 2 Is Executive
# 3 Is Management
# 4 Is Superuser