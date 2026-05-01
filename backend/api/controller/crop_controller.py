from api.schemas.crop_schema import Cropschema
from api.service.crop_service import CropService

class CropController:
    def __init__(self):
        self.crop = CropService()

    def get_all_crops(self):
        try:
            crops = self.crop.get_all_crops()
            schema = Cropschema(many=True)
            return {"crops" : schema.dump(crops)}, 200
        except Exception as e:
            return {"error": "An error occurred while fetching crops"}, 500

    def get_crop_by_id(self, id):
        try:
            crop = self.crop.get_crop_by_id(id)
            if crop is None or crop.id is None:
                return {"error": "Crop is not Found"}, 404
            schema = Cropschema()
            return {"crop": schema.dump(crop)}, 200
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": "An error occurred while fetching the crop"}, 500

    def add_crop(self, crop_data):
        try:
            schema = Cropschema()
            crop = schema.load(crop_data)
            new_crop = self.crop.add_crop(crop)
            return {"message": "Crop added successfully", "crop": schema.dump(new_crop)}, 201
        except Exception as e:
            print(f"Hata detayı: {str(e)}")
            return {"error": "An error occurred while adding the crop"}, 500