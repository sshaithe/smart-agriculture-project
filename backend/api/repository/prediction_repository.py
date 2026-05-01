from api.entity.prediction import Prediction
from app.extensions import db


class PredictionRepository:
    @staticmethod
    def get_all_prediction():
        return Prediction.query.order_by(Prediction.created_at.desc()).all()

    @staticmethod
    def get_by_prediction_id(id: int):
       
        return Prediction.query.get(id)

    @staticmethod
    def get_by_user(user_id: int):
        return Prediction.query.filter_by(user_id=user_id).order_by(Prediction.created_at.desc()).all()

    @staticmethod
    def add(prediction: Prediction):
        db.session.add(prediction)
        db.session.commit()
        return prediction