from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser
from datetime import datetime
from django.utils.html import format_html

# Register your models here.

class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    model = CustomUser

    # The fields to be used in displaying the CustomUser model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('username', 'email', 'first_name', 'last_name', 'date_joined',
                    'last_login', 'is_active', 'is_staff', 'picture', "show_picture")
    list_filter = ('is_staff', 'is_superuser')
    search_fields = ('username', 'email',)
    ordering = ('username', 'email')

    def show_picture(self, obj):

        return format_html('<a href="%s">%s</a>' % (obj.picture, "Show Picture"))

    show_picture.allow_tags = True
    show_picture.short_description = "Show Profile Pic"

    readonly_fields = ["date_joined", 'last_login']

    date_hierarchy = 'last_login'


class GenreAdmin(admin.ModelAdmin):
    """"""
    pass


class LanguageAdmin(admin.ModelAdmin):
    """"""
    pass


class BookAdmin(admin.ModelAdmin):
    """"""
    pass


class BorrowerAdmin(admin.ModelAdmin):
    """"""
    pass


admin.site.register(CustomUser, UserAdmin)
admin.site.register(Genre, GenreAdmin)
admin.site.register(Language, LanguageAdmin)
admin.site.register(Book, BookAdmin)
admin.site.register(Borrower, BorrowerAdmin)