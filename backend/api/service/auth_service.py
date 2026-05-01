from ..entity.user import User
from ..repository.auth_repository import UserRepository
from .password_service import hash_password, verify_password
from flask_jwt_extended import create_access_token

class AuthService:
    def __init__(self):
        self.users = UserRepository()

    def register(self, email: str, password: str, username: str = None):
        if self.users.find_by_email(email):
            raise ValueError("Email already exists")

        user = User(email=email, password=hash_password(password), username=username)
        return self.users.save(user)

    def login(self, email: str, password: str):
        user = self.users.find_by_email(email)
        if not user or not verify_password(password, user.password):
            raise ValueError("Invalid email or password")

        token = create_access_token(identity=str(user.id))
        return user, token