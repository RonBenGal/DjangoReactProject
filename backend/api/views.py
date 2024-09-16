from django.contrib.auth.models import User
from rest_framework import mixins, status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView , ListCreateAPIView , DestroyAPIView , CreateAPIView
from .serializers import UserSerializer , NoteSerializer , CounterSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note , Counter
from django.shortcuts import get_object_or_404
# Create your views here.

class NoteListCreate(ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author = user) 
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author = user)        
    
class CreateUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CounterView(GenericAPIView):

    queryset = Counter.objects.all()
    permission_classes = [AllowAny]
    serializer_class = CounterSerializer

    def get(self, request, *args, **kwargs):
        """Retrieve the global counter."""
        counter = Counter.objects.first()  # Fetch the single, global counter
        if counter is None:
            return Response({"detail": "Counter does not exist."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(counter)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """Create the global counter if it doesn't exist."""
        if Counter.objects.exists():
            return Response({"detail": "Counter already exists."}, status=status.HTTP_400_BAD_REQUEST)

        counter = Counter.objects.create(count=0)  # Create a global counter with count = 0
        serializer = self.get_serializer(counter)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, *args, **kwargs):
        """Increment or decrement the global counter."""
        counter = Counter.objects.first()  # Fetch the single, global counter
        if counter is None:
            return Response({"detail": "Counter does not exist."}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        if action == 'increment':
            counter.increment()  # Custom method to increment
        elif action == 'decrement':
            if counter.count > 0:
                counter.decrement()  # Custom method to decrement
            else:
                return Response({"detail": "Counter value cannot be negative"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(counter)
        return Response(serializer.data, status=status.HTTP_200_OK)
