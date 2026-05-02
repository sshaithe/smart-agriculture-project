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
            observations = self.observation.get_observation_by_city(city_id=city_id)
            schema = Observationschema(many=True)
            return {"observation": schema.dump(observations)}, 200
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def add_observation(self, observation_data):
        try:
            schema = Observationschema()
            observation = schema.load(observation_data)
            new_observation = self.observation.add_observation(observation)
            return {"message": "Observation added successfully", "observation": schema.dump(new_observation)}, 201
        except Exception as e:
            return {"error": f"An error occurred while adding the observation: {str(e)}"}, 500

    def update_observation(self, id, observation_data):
        try:
            existing = self.observation.get_by_id(id)
            if not existing:
                return {"error": "Observation not found"}, 404

            updatable = [
                "region_id", "city_id", "crop_id", "year", "latitude", "longitude",
                "t2m", "t2m_max", "t2m_min", "rh2m", "prectotcorr", "ws2m",
                "allsky_sfc_sw_dwn", "soil_temp_0_7", "soil_temp_7_28",
                "soil_moisture_0_7", "soil_moisture_7_28"
            ]
            for field in updatable:
                if field in observation_data:
                    setattr(existing, field, observation_data[field])

            updated = self.observation.update_observation(existing)
            schema = Observationschema()
            return {"message": "Observation updated successfully", "observation": schema.dump(updated)}, 200
        except Exception as e:
            return {"error": f"An error occurred while updating the observation: {str(e)}"}, 500

    def delete_observation(self, id):
        try:
            existing = self.observation.get_by_id(id)
            if not existing:
                return {"error": "Observation not found"}, 404
            self.observation.delete_observation(existing)
            return {"message": "Observation deleted successfully"}, 200
        except Exception as e:
            return {"error": f"An error occurred while deleting the observation: {str(e)}"}, 500