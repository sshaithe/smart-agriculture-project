from flask import Blueprint
from api.controller.city_controller import CityController

blueprint = Blueprint("city", __name__)
city_controller = CityController()

@blueprint.get("/city/all")
def get_all_city():
    return city_controller.get_all_city()

@blueprint.get("/city/<int:id>")
def get_city_by_id(id):
    return city_controller.get_city_by_id(id)

@blueprint.get("/city/region/<int:region_id>")
def get_city_by_region(region_id):
    return city_controller.get_city_by_region_id(region_id)

@blueprint.get("/city/name/<string:city_name>")
def get_city_by_name(city_name):
    return city_controller.get_city_by_name(city_name)

@blueprint.post("/city/add")
def add_city():
    return city_controller.add_city()

@blueprint.delete("/city/<int:id>")
def delete_city(id):
    return city_controller.delete_city(id)