from math import trunc

from api.service.observation_service import ObservationService
from api.schemas.observation_schema import Observationschema

class ObservationController:
    def __init__(self):
        self.observation = ObservationService()

    def get_all_observation(self):
        try:
            observations = self.observation.get_all_observation()
            schema = Observationschema(many=True)
            return {"observations": schema.dump(observations)}, 200
        except Exception as e:
            return {"error": "An error occurred while fetching observations"}, 500

    def get_observation_by_region(self, id):
        try:
            observations = self.observation.get_observation_by_region(id)
            schema = Observationschema(many=True)
            return {"observations": schema.dump(observations)}, 200
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": "An error occurred while fetching observations"}, 500

    def get_observation_by_city(self, city_id):
        try:
            observations = self.observation.get_observation_by_city(city_id = city_id)
            schema = Observationschema(many = True)
            return { "observation": schema.dump(observations) }, 200
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return { "error": str(e)}, 500

    def add_observation(self, observation_data):
        try:
            schema = Observationschema()
            observation = schema.load(observation_data)
            new_observation = self.observation.add_observation(observation)
            return {"message": "Observation added successfully", "observation": schema.dump(new_observation)}, 201
        except Exception as e:
            return {"error": f"An error occurred while adding the observation: {str(e)}"}, 500