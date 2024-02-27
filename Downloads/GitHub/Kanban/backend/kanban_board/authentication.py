from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.middleware.csrf import CsrfViewMiddleware

class CsrfExemptSessionAuthentication(CsrfViewMiddleware):
    def _reject(self, request, reason):
        return None  # Avoid returning the 403 error

class EmailAuthBackend(ModelBackend):
    """
    Authenticates against user's email address instead of username.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        if username is None or password is None:
            return
        try:
            user = UserModel.objects.get(**{UserModel.USERNAME_FIELD: username})
        except UserModel.DoesNotExist:
            # User not found
            return None
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user