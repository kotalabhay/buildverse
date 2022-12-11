# Python Social Auth Pipelines Here

from django.shortcuts import redirect


# Pipeline for handling the unauthorized domain error Rather than showing Django Traceback page
def auth_allowed(backend, details, response, *args, **kwargs):

    if not backend.auth_allowed(response, details):
        return redirect('/unauthorized_domain')


def get_avatar(backend, strategy, details, response, user=None, *args, **kwargs):
    url = None
    if backend.name == 'google-oauth2':
        url = response.get('picture', None)
        if url:
            user.picture = url
            user.save()
        else:
            user.picture = None
            user.save()

    else:
        pass
