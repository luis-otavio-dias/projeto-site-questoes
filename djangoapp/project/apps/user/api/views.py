from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view
from rest_framework.response import Response

from project.apps.user.models import User
from project.apps.user.api.serializers import UserSerializer


@api_view(["GET"])
def getUser(request, id):
    user = get_object_or_404(User, id=id)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)
