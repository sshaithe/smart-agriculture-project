from flask import Blueprint
from flask_jwt_extended import jwt_required

blueprint = Blueprint('prediction', __name__)


_controller = None

def _get_controller():
    global _controller
    if _controller is None:
        from api.controller.prediction_controller import PredictionController
        _controller = PredictionController()
    return _controller

@blueprint.get("/prediction/all")
def get_all_prediction():
    return _get_controller().get_all_prediction()

@blueprint.get("/prediction/<int:id>")
def get_prediction_by_id(id):
    return _get_controller().get_prediction_by_id(id)

@blueprint.post("/prediction/crop")
@jwt_required(optional=True)
def predict_crop():
    return _get_controller().predict_crop()

@blueprint.post("/prediction/yield")
@jwt_required(optional=True)
def predict_yield():
    return _get_controller().predict_yield()

@blueprint.post("/prediction/disease")
@jwt_required(optional=True)
def predict_disease():
    return _get_controller().predict_disease()

@blueprint.post("/prediction/risk")
@jwt_required(optional=True)
def assess_risk():
    return _get_controller().assess_risk()