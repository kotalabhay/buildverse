from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse
from core.settings import LOGIN_REDIRECT_URL
from .models import *
from django.core import serializers
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import permission_required
from django.core.exceptions import PermissionDenied
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

def login_view(request):
    return render(request, "accounts/login.html")


@login_required(login_url="/login/")
def index(request):
    """

    :param request:
    :return:
    """
    context = {"segment": "index"}
    html_template = loader.get_template("home/index.html")
    return redirect("/books")
    #return HttpResponse(html_template.render(context, request))


@login_required(login_url=LOGIN_REDIRECT_URL)
def pages(request):
    """

    :param request:
    :return:
    """
    context = {}
    # All resource paths end in .html.
    # Pick out the html file name from the url. And load that template.
    try:
        load_template = request.path.split("/")[-1]

        if load_template == "admin":
            return HttpResponseRedirect(reverse("admin:index"))
        context["segment"] = load_template

        html_template = loader.get_template("home/" + load_template)
        return HttpResponse(html_template.render(context, request))

    except template.TemplateDoesNotExist:
        html_template = loader.get_template("home/page-404.html")
        return HttpResponse(html_template.render(context, request))
    except:
        html_template = loader.get_template("home/page-500.html")
        return HttpResponse(html_template.render(context, request))




@login_required(login_url=LOGIN_REDIRECT_URL)
def books(request):
    """

    :param request:
    :return:
    """
    context = {"segment": "books"}
    html_template = loader.get_template("home/books.html")
    return HttpResponse(html_template.render(context, request))

class BooksData(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, format=None):
        try:
            queryset = Book.objects.all()
            serializer = BookSerializer(queryset, many=True)
            if serializer:
                data = {'data': serializer.data}
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@login_required(login_url=LOGIN_REDIRECT_URL)
def my_borrowed_books(request):
    """

    :param request:
    :return:
    """
    context = {"segment": "borrow"}
    html_template = loader.get_template("home/my_borrowed_books.html")
    return HttpResponse(html_template.render(context, request))


class BorrowedBooksData(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        try:
            queryset = Borrower.objects.all()
            serializer = BorrowerSerializer(queryset, many=True)
            print("Data", serializer)
            if serializer:
                data = {'data': serializer.data}
                print(data)
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            raise(e)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def librarian(request):
    """

    :param request:
    :return:
    """
    context = {"segment": "librarian"}
    html_template = loader.get_template("home/librarian.html")
    return HttpResponse(html_template.render(context, request))







