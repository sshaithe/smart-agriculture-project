from api.entity.crop import Crop
from app.extensions import db

class CropRepository:
    @staticmethod
    def get_all_crops():
        return Crop.query.all()

    @staticmethod
    def get_by_id(id):
        return Crop.query.get(id)

    @staticmethod
    def add(crop):
        db.session.add(crop)
        db.session.commit()
        return crop
