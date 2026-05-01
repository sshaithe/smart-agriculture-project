from flask import Blueprint
from api.controller.region_controller import RegionController

blueprint = Blueprint('region', __name__)
region_controller = RegionController()

@blueprint.get("/region/all")
def get_all_region():
    return region_controller.get_all_regions()

@blueprint.get("/region/<int:id>")
def get_region_by_id(id):
    return region_controller.get_region_by_id(id)

@blueprint.post("/region/add")
def add_region():
    return region_controller.add_region()