from flask import Blueprint
from api.controller.auth_controller import AuthController
from api.controller.prediction_controller import PredictionController
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.repository.prediction_repository import PredictionRepository

auth_bp = Blueprint('auth', __name__)
controller = AuthController()

@auth_bp.post("/register")
def register():
    return controller.register()

@auth_bp.post("/login")
def login():
    return controller.login()

@auth_bp.get("/profile")
def get_profile():
    return controller.get_profile()

@auth_bp.put("/profile")
def update_profile():
    return controller.update_profile()

@auth_bp.get("/user/predictions")
@jwt_required()
def user_predictions():
    """Return all predictions made by the currently logged-in user."""
    user_id = int(get_jwt_identity())
    predictions = PredictionRepository.get_by_user(user_id)
    return {"predictions": [p.to_dict() for p in predictions]}, 200