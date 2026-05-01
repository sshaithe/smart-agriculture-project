from app.extensions import ma
from api.entity.prediction import Prediction


class PredictionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model       = Prediction
        load_instance = True
        include_fk  = True