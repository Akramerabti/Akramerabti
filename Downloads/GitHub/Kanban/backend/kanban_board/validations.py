from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
UserModel = get_user_model()


class UserValidation:
    def __init__(self, data):
        self.data = data

    def registerValidation(self):
        username = self.data.get('username', '').strip()
        password = self.data.get('password', '').strip()

        if not password:
            raise ValidationError('Choose another password')

        if not username:
            raise ValidationError('Choose another username')

        return self.data

    def loginValidation(self):
        username = self.data.get('username', '').strip()
        if len(username) == 0:  # Check if empty after stripping whitespace
            raise ValidationError('Username cannot be empty.')

        password = self.data.get('password', '').strip()
        if len(password) == 0:
            raise ValidationError('Password cannot be empty.')

        return self.data