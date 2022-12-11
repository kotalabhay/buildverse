
from django.db import models
from django.db.models import fields
from rest_framework import serializers
from .models import *
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = '__all__'


class GenreSerializer(ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class LanguageSerializer(ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class BookSerializer(ModelSerializer):
    genre = GenreSerializer(many=True, read_only=True)
    language = LanguageSerializer(many=True, read_only=True)
    book = serializers.CharField(read_only=True)

    class Meta:
        model = Book
        fields = '__all__'
        extra_kwargs = {'genre': {'required': False}, 'language': {'required': False} }


class BorrowerSerializer(ModelSerializer):
    genre = GenreSerializer(many=True, read_only=True)
    language = LanguageSerializer(many=True, read_only=True)
    book_name = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = Borrower
        fields = ('id', 'issue_date', 'book_name', 'return_date', 'is_borrowed', 'book_returned', 'language', 'genre')
        extra_kwargs = {'genre': {'required': False}, 'language': {'required': False}}
