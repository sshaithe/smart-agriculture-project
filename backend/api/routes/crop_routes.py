from flask import Blueprint, request
from api.controller.crop_controller import CropController

blueprint = Blueprint('crop', __name__)
controller = CropController()

@blueprint.get("/crop/all")
def get_all_crops():
    return controller.get_all_crops()

@blueprint.get("/crop/<int:id>")
def get_crop_by_id(id):
    return controller.get_crop_by_id(id)

@blueprint.post("/crop/add")
def add_crop():
    crop_data = request.get_json()
    return controller.add_crop(crop_data = crop_data)