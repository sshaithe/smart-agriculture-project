from api.entity.observation import Observation
from app.extensions import db

class ObservationRepository:
    @staticmethod
    def get_all_observation():
        return Observation.query.all()

    @staticmethod
    def get_by_region(id):
        return Observation.query.filter_by(region_id=id).all()

    @staticmethod
    def get_observation_by_city(city_id):
        return Observation.query.filter_by(city_id=city_id).all()

    @staticmethod
    def add(observation):
        db.session.add(observation)
        db.session.commit()
        return observation