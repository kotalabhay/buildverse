from django.db import models
import jsonfield
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from datetime import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils.html import mark_safe
from dateutil import parser
# Create your models here.
from datetime import datetime, date, timedelta
from django.db.models.signals import post_save
from django.db.models.signals import pre_save, pre_delete, post_delete

class UserManager(BaseUserManager):
    def create_user(self, username, email, first_name, last_name, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not username:
            raise ValueError('Users must have an valid username')

        if not email:
            raise ValueError('Users must have an valid email')

        user = self.model(
            username=username, email=self.normalize_email(email), first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.is_active = True
        user.save(using=self._db)
        return user

    def create_staffuser(self, username, email, first_name, last_name, password):
        """
        Creates and saves a staff user with the given email and password.
        """
        user = self.create_user(
            username,
            email=self.normalize_email(email),
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        user.is_active = True
        user.is_staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, first_name, last_name, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            username,
            email=self.normalize_email(email),
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """"""
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(verbose_name='Email', max_length=100, unique=True)
    first_name = models.CharField(max_length=100, blank=True, verbose_name='First Name')
    last_name = models.CharField(max_length=100, blank=True, verbose_name='Last Name')
    date_joined = models.DateTimeField(verbose_name='Date Joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='Last Login', auto_now=True)
    picture = models.URLField(max_length=200, blank=True, null=True)
    TYPE_CHOICES = (
        ('anyone ', 'Anyone '),
        ('student', 'Student'),
        ('librarian', 'Librarian'),
    )
    user_type = models.CharField(max_length=50, blank=False, null=False, choices=TYPE_CHOICES, default="student")
    is_active = models.BooleanField(default=True, help_text='Designates whether this user should be treated as active')
    is_staff = models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site')
    USERNAME_FIELD = 'username'   # Mandate field for authentication email,uid, username( any that is Unique)
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']  # Compulsory fields

    objects = UserManager()  # Creating Object

    def __str__(self):
        return self.username

    @property
    def picture_preview(self):
        if self.picture:
            return mark_safe('<img src="{}" width="300" height="300" />'.format(self.picture))
        return ""

    class Meta:
        db_table = "auth_user"
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ('username',)


class Genre(models.Model):
    name = models.CharField(
        max_length=200, help_text="Enter a book genre (e.g. Science Fiction, French Poetry etc.)")

    def __str__(self):
        return self.name

    class Meta:
        db_table = "genre"
        verbose_name = "Genre"
        verbose_name_plural = "Genres"
        ordering = ('name',)


class Language(models.Model):
    name = models.CharField(max_length=200,
                            help_text="Enter the book's natural language (e.g. English, French, Japanese etc.)")

    def __str__(self):
        return self.name

    class Meta:
        db_table = "language"
        verbose_name = "Language"
        verbose_name_plural = "Languages"
        ordering = ('name',)


class Book(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    summary = models.TextField(
        max_length=1000, help_text="Enter a brief description of the book")
    isbn = models.CharField('ISBN', max_length=13,
                            help_text='13 Character https://www.isbn-international.org/content/what-isbn')
    genre = models.ManyToManyField(
        Genre, help_text="Select a genre for this book")
    language = models.ManyToManyField(
        Language, help_text="Select a Language for this book")
    total_copies = models.IntegerField(default=10)
    pic = models.URLField(max_length=200, blank=True, null=True)
    available_copies = models.IntegerField(name='available_copies')
    return_days = models.IntegerField(help_text='Return Days', default=30)

    def __str__(self):
        return self.title

    class Meta:
        db_table = "book"
        verbose_name = "Book"
        verbose_name_plural = "Books"
        ordering = ('title',)


class Borrower(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    user = models.ForeignKey('CustomUser', on_delete=models.SET_NULL, null=True, blank=True)
    book = models.ForeignKey('Book', on_delete=models.SET_NULL, null=True, blank=True)
    issue_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)
    is_borrowed = models.BooleanField(default=True)
    book_returned = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.username + " borrowed " + self.book.title

    def save(self, *args, **kwargs):
        if not self.id:
            self.issue_date = datetime.now()
        self.return_date = self.issue_date + timedelta(days=self.book.return_days)
        super(Borrower, self).save(*args, **kwargs)

    def overdue_status(self):
        today = datetime.today()
        if today > self.return_date:
            return True
        else:
            return False

    def overdue_count_days(self):
        today = datetime.today()
        if today > self.return_date:
            return (self.return_date - today).days
        else:
            return 0

    class Meta:
        db_table = "borrower"
        verbose_name = "Borrower"
        verbose_name_plural = "Borrowers"
        ordering = ('user',)


def borrower_update_copies(sender, instance, created, **kwargs):

    try:
        # Case when Borrower is created
        if created:
            instance.book.available_copies -= 1

        # Case when Borrowed Record might have been updated but still book is borrowed
        if instance.is_borrowed is True:
            pass

        elif instance.is_borrowed is False:
            instance.book.available_copies += 1
            if not instance.book.book_returned:
                instance.book.book_returned = datetime.now()

        instance.book.save()

    except:
        raise ValueError('Error while updating')

post_save.connect(borrower_update_copies, sender=Borrower)