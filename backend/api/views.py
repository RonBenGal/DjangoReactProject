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
    serializer_class = CounterSerializer

    def get_object(self):
        # Enforce that the counter's id matches the user's id
        try:
            counter = Counter.objects.get(id=self.request.user.id)
            return counter
        except Counter.DoesNotExist:
            counter = Counter.objects.create(id=self.request.user.id)
            return counter

    def get(self, request):
        """Handle GET requests to retrieve the user's counter."""
        counter = self.get_object()
        if isinstance(counter, Response):  # Counter not found (404 was returned)
            return counter
        serializer = CounterSerializer(counter)
        return Response(serializer.data)

    def post(self, request):
        """Handle POST requests to update the user's counter based on the action."""
        counter = self.get_object()
        if isinstance(counter, Response):  # Counter not found (404 was returned)
            return counter

        action = request.data.get("action")
        if action == "increment":
            counter.increment()
        elif action == "decrement":
            if counter.count == 0:
                return Response({"error": "Counter cannot go below 0"}, status=status.HTTP_400_BAD_REQUEST)
            counter.decrement()
        elif action == "reset":
            counter.reset()
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CounterSerializer(counter)
        return Response(serializer.data)
