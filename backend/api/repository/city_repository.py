from api.entity.city import City
from app.extensions import db

class CityRepository:
    @staticmethod
    def get_all_cities():
        return City.query.all()

    @staticmethod
    def get_by_id(id):
        return City.query.get(id)

    @staticmethod
    def add(city):
        db.session.add(city)
        db.session.commit()
        return city

    @staticmethod
    def get_by_name(name):
        return City.query.filter_by(name=name).first()

    @staticmethod
    def get_by_region_id(region_id):
        return City.query.filter_by(region_id = region_id).all()

    @staticmethod
    def delete(city):
        db.session.delete(city)
        db.session.commit()