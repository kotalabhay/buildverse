from django.urls import path, re_path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.views import LogoutView


urlpatterns = [
    # The home page
    path("", views.index, name="home"),
    path("my_borrowed_books", views.my_borrowed_books, name="my_borrowed_books"),
    path('my_borrowed_books_data', views.BorrowedBooksData.as_view(), name='my_borrowed_books_data'),
    path('librarian_data', views.LibrarianData.as_view(), name='librarian_data'),
    path("librarian", views.librarian, name="librarian"),
    path("books", views.books, name="books"),
    path('book_data', views.BooksData.as_view(), name='book_data'),
    path('login/', views.login_view, name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    # Matches any html file
    re_path(r"^.*\.*", views.pages, name="pages"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
