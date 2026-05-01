from api.repository.crop_repository import CropRepository

class CropService:
    def __init__(self):
        self.crop = CropRepository()

    def get_all_crops(self):
        return self.crop.get_all_crops()

    def get_crop_by_id(self, id):
        try:
            id = int(id)
            if id <= 0:
                raise ValueError("ID must be a positive integer")
        except ValueError as e:
            raise ValueError(f"Invalid ID: {e}")
        return self.crop.get_by_id(id)

    def add_crop(self, crop):
        try:
            return self.crop.add(crop=crop)
        except ValueError as e:
            raise ValueError(e)

    def get_crop_by_name(self, name):
        return self.crop.get_by_name(name)

    def delete_crop(self, crop):
        return self.crop.delete(crop)