from flask import request
from api.service.city_service import CityService
from api.schemas.city_schema import CitySchema

class CityController:
    def __init__(self):
        self.city_service = CityService()
        self.schema_one = CitySchema()
        self.schema_many = CitySchema(many=True)

    def get_all_city(self):
        try:
            cities = self.city_service.get_all_cities()
            # DB boşsa [] döner, bu normal
            return {"cities": self.schema_many.dump(cities)}, 200
        except Exception as e:
            print("get_all_city error:", e)
            return {"error": "An error occurred while fetching cities"}, 500

    def get_city_by_id(self, id: int):
        try:
            city = self.city_service.get_city_by_id(id)
            if not city:
                return {"error": "City not found"}, 404
            return {"city": self.schema_one.dump(city)}, 200
        except Exception as e:
            print("get_city_by_id error:", e)
            return {"error": "An error occurred while fetching the city"}, 500

    def get_city_by_region_id(self, region_id: int):
        try:
            city_by_region = self.city_service.get_city_by_region_id(region_id)
            if not city_by_region:
                return {"error": "City not found"}, 404
            return {"city": [city.to_dict() for city in city_by_region]}, 200
          #  return {"city": self.schema_many.dump(city_by_region)}, 200
        except Exception as e:
            print("get_city_by_id error:", e)
            return {"error": "An error occurred while fetching the city"}, 500

    def get_city_by_name(self, city_name: str):
        try:
            city = self.city_service.get_city_by_name(city_name)
            if not city:
                return {"error": "City not found"}, 404
            return {"city": self.schema_one.dump(city)}, 200
        except Exception as e:
            print("get_city_by_name error:", e)
            return {"error": "An error occurred while fetching the city"}, 500

    def add_city(self):
        try:
            city_data = request.get_json(silent=True) or {}
            city = self.schema_one.load(city_data)
            new_city = self.city_service.add_city(city)
            return {"message": "City added successfully", "city": self.schema_one.dump(new_city)}, 201
        except Exception as e:
            print("add_city error:", e)
            return {"error": "An error occurred while adding the city"}, 500

    def delete_city(self, id: int):
        try:
            deleted_city = self.city_service.delete_city(id)
            if not deleted_city:
                return {"error": "City not found"}, 404
            return {"message": "City deleted successfully", "city": self.schema_one.dump(deleted_city)}, 200
        except Exception as e:
            print("delete_city error:", e)
            return {"error": "An error occurred while deleting the city"}, 500