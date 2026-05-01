from flask import request

from api.service.region_service import RegionService
from api.schemas.region_schema import RegionSchema

class RegionController:
    def __init__(self):
        self.region = RegionService()

    def get_all_regions(self):
        try:
            regions = self.region.get_all_regions()
            schema = RegionSchema(many=True)
            return {"regions": schema.dump(regions)}, 200
        except Exception as e:
            return {"error": "An error occurred while fetching regions"}, 500

    def get_region_by_id(self, id):
        try:
            region = self.region.get_region_by_id(id)
            if region is None or region.id is None:
                return {"error": "Region not found"}, 404
            schema = RegionSchema()
            return {"region": schema.dump(region)}, 200
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": "An error occurred while fetching the region"}, 500

    def add_region(self):
        try:
            region_data = request.get_json(silent=True) or {}
            schema = RegionSchema()
            region = schema.load(region_data)
            new_region = self.region.add_region(region)
            return {
                "message": "Region added successfully",
                "region": schema.dump(new_region)
            }, 201
        except Exception as e:
            return {"error": f"Failed to add region: {str(e)}"}, 500