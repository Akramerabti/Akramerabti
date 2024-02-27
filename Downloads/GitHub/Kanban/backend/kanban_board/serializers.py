from django.contrib.auth import get_user_model,authenticate
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import Board, Column, Task, Event
from rest_framework import generics

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) 

    class Meta:
        model = User
        fields = ('id', 'username', 'password')  # Include 'username'

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'], 
            password=validated_data['password']  
        )
        return user 

class SubtaskSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Task
        fields = ['name', 'description', 'status', 'parent', 'owner', 'id']


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    subtasks = SubtaskSerializer(many=True, required=False)

    class Meta:
        model = Task
        fields = ['name', 'description', 'status', 'parent', 'owner', 'id', 'subtasks', 'board', 'column']

    def create(self, validated_data):
        # First we create 'mod' data for the AssetModel
        subtask_data = validated_data.pop('subtasks') if "subtasks" in validated_data else []
        task = Task.objects.create(**validated_data)

        for subtask_data in subtask_data:
            if "id" in subtask_data:
                subtask_data.pop("id")
            Task.objects.create(parent=task, board=task.board, column=task.column, **subtask_data)

        return task

    def update(self, instance, validated_data):
        # First we create 'mod' data for the AssetModel
        subtasks_data = validated_data.pop('subtasks') if "subtasks" in validated_data else []
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.status = validated_data.get("status", instance.status)
        instance.save()

        subtask_ids = []
        for subtask_data in subtasks_data:
            if "id" in subtask_data:
                subtask_id = subtask_data.pop("id")
                Task.objects.filter(id=subtask_id).update(**subtask_data)
                subtask_ids.append(subtask_id)

            else:
                # removed autoset fields
                for field in ["parent", "board", "column"]:
                    if field in subtask_data:
                        subtask_data.pop(field)

                subtask = Task.objects.create(parent=instance, board=instance.board, column=instance.column,
                                              **subtask_data)
                subtask_ids.append(subtask.id)

        if subtask_ids:
            Task.objects.filter(parent=instance).exclude(id__in=subtask_ids).delete()

        return instance


class ColumnSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ['id', 'name', 'tasks']


class BoardSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    columns = ColumnSerializer(many=True, required=False)

    class Meta:
        model = Board
        fields = ['id', 'name', 'columns', 'owner']

    def create(self, validated_data):
        # First we create 'mod' data for the AssetModel
        columns_data = validated_data.pop('columns') if "columns" in validated_data else []
        board = Board.objects.create(**validated_data)

        for column_data in columns_data:
            if "id" in column_data:
                column_data.pop("id")
            column = Column.objects.create(board=board, **column_data)

        return board

    def update(self, instance, validated_data):
        # First we create 'mod' data for the AssetModel
        columns_data = validated_data.pop('columns') if "columns" in validated_data else []
        instance.name = validated_data.get("name", instance.name)
        instance.save()

        column_ids = []
        for column_data in columns_data:
            if "id" in column_data:
                column_id = column_data.pop("id")
                Column.objects.filter(id=column_id).update(**column_data)
                column_ids.append(column_id)

            else:
                column = Column.objects.create(board=instance, **column_data)
                column_ids.append(column.id)

        if column_ids:
            Column.objects.filter(board=instance).exclude(id__in=column_ids).delete()

        return instance

class EventSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    task = TaskSerializer(required=False)  # Represent the associated task

    class Meta:
        model = Event
        fields = '__all__' 

class BoardListCreateView(generics.ListCreateAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer