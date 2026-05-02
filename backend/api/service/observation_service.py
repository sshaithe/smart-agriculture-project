from api.repository.observation_repository import ObservationRepository

class ObservationService:
    def __init__(self):
        self.observation = ObservationRepository()

    def get_all_observation(self):
        return self.observation.get_all_observation()

    def get_observation_by_region(self, id):
        try:
            id = int(id)
            if id <= 0:
                raise ValueError("ID must be a positive integer")
        except ValueError as e:
            raise ValueError(f"Invalid ID: {e}")
        return self.observation.get_by_region(id)

    def get_observation_by_city(self, city_id):
        try:
            city_id = int(city_id)
            if city_id <= 0:
                raise ValueError("ID must be a positive Integer")
        except ValueError as e:
            raise ValueError(f"Invalid ID: {e}")
        return self.observation.get_observation_by_city(city_id=city_id)

    def add_observation(self, observation):
        return self.observation.add(observation)

    def get_by_id(self, id):
        return self.observation.get_by_id(id)

    def update_observation(self, observation):
        return self.observation.update(observation)

    def delete_observation(self, observation):
        return self.observation.delete(observation)