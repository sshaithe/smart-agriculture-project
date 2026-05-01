from api.entity.region import Region
from app.extensions import db

class RegionRepository:
    @staticmethod
    def get_all_regions():
        return Region.query.all()

    @staticmethod
    def get_by_id(id):
        return Region.query.get(id)

    @staticmethod
    def add(region):
        db.session.add(region)
        db.session.commit()
        return region

    @staticmethod
    def get_by_name(name):
        return Region.query.filter_by(name=name).first()

    @staticmethod
    def delete(region):
        db.session.delete(region)
        db.session.commit()