from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.schemas.auth_schema import LoginSchema, RegisterSchema
from api.service.auth_service import AuthService
from api.repository.auth_repository import UserRepository

class AuthController:
    def __init__(self):
        self.service = AuthService()
        self.user_repo = UserRepository()

    def register(self):
        payload = request.get_json(silent=True) or {}

        try:
            data = RegisterSchema(**payload)
            user = self.service.register(data.email, data.password, data.username)
            return {"message": "User registered successfully", "user": user.to_dict()}, 201
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": "An error occurred during registration"}, 500

    def login(self):
        payload = request.get_json(silent=True) or {}

        try:
            data = LoginSchema(**payload)
            user, token = self.service.login(data.email, data.password)
            return {"message": "Login successful", "user": user.to_dict(), "token": token}, 200
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": "An error occurred during login"}, 500

    @jwt_required()
    def get_profile(self):
        """Return the currently authenticated user's profile."""
        user_id = get_jwt_identity()
        user = self.user_repo.find_by_id(int(user_id))
        if not user:
            return {"error": "User not found"}, 404
        return {"user": user.to_dict()}, 200

    @jwt_required()
    def update_profile(self):
        """Update the currently authenticated user's profile (username, email)."""
        user_id = get_jwt_identity()
        user = self.user_repo.find_by_id(int(user_id))
        if not user:
            return {"error": "User not found"}, 404

        payload = request.get_json(silent=True) or {}
        if "username" in payload:
            user.username = payload["username"]
        if "email" in payload:
            existing = self.user_repo.find_by_email(payload["email"])
            if existing and existing.id != user.id:
                return {"error": "Email already in use"}, 400
            user.email = payload["email"]

        self.user_repo.save(user)
        return {"message": "Profile updated", "user": user.to_dict()}, 200