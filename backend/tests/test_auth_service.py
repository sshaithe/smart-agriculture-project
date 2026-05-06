import pytest

from api.entity.user import User
from api.service.auth_service import AuthService
from api.service.password_service import hash_password


class FakeUserRepository:
    def __init__(self, users=None):
        self.users = users or []

    def find_by_email(self, email: str):
        return next((user for user in self.users if user.email == email), None)

    def save(self, user: User):
        if user.id is None:
            user.id = len(self.users) + 1
        self.users.append(user)
        return user


def test_register_creates_user_with_hashed_password():
    service = AuthService()
    service.users = FakeUserRepository()

    user = service.register(email="new@example.com", password="Password123", username="newuser")

    assert user.email == "new@example.com"
    assert user.username == "newuser"
    assert user.password != "Password123"
    assert service.users.find_by_email("new@example.com") is user


def test_register_rejects_duplicate_email():
    existing_user = User(email="dupe@example.com", password="hashed")
    service = AuthService()
    service.users = FakeUserRepository(users=[existing_user])

    with pytest.raises(ValueError, match="Email already exists"):
        service.register(email="dupe@example.com", password="Password123")


def test_login_returns_token_and_user(monkeypatch):
    user = User(email="login@example.com", password=hash_password("Password123"))
    user.id = 42
    service = AuthService()
    service.users = FakeUserRepository(users=[user])
    monkeypatch.setattr("api.service.auth_service.create_access_token", lambda identity: f"token-{identity}")

    logged_in_user, token = service.login(email="login@example.com", password="Password123")

    assert logged_in_user is user
    assert token == "token-42"


def test_login_rejects_invalid_credentials():
    user = User(email="login@example.com", password=hash_password("Password123"))
    service = AuthService()
    service.users = FakeUserRepository(users=[user])

    with pytest.raises(ValueError, match="Invalid email or password"):
        service.login(email="login@example.com", password="WrongPassword")


def test_login_rejects_missing_user():
    service = AuthService()
    service.users = FakeUserRepository()

    with pytest.raises(ValueError, match="Invalid email or password"):
        service.login(email="missing@example.com", password="Password123")
