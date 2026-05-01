from api.repository.city_repository import CityRepository

class CityService:
    def __init__(self):
        self.city = CityRepository()

    def get_all_cities(self):
        return self.city.get_all_cities()

    def get_city_by_id(self, id):
        try:
            id = int(id)
            if id <= 0:
                raise ValueError("ID must be a positive integer")
        except ValueError as e:
            raise ValueError(f"Invalid ID: {e}")
        return self.city.get_by_id(id)

    def get_city_by_region_id(self, region_id):
        try:
        #    region_id = int(id)
            if region_id <= 0:
                raise ValueError("Id is must be positive Integer")
        except ValueError as e:
            raise ValueError(f"Invalid Id")
        return self.city.get_by_region_id(region_id)

    def add_city(self, city):
        return self.city.add(city)

    def get_city_by_name(self, name):
        return self.city.get_by_name(name)

    def delete_city(self, city):
        return self.city.delete(city)