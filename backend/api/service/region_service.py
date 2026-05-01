from api.repository.region_repository import RegionRepository

class RegionService:
    def __init__(self):
        self.region = RegionRepository()

    def get_all_regions(self):
        return self.region.get_all_regions()

    def get_region_by_id(self, id):
        try:
            id = int(id)
            if id <= 0:
                raise ValueError("ID must be a positive integer")
        except ValueError as e:
            raise ValueError(f"Invalid ID: {e}")
        return self.region.get_by_id(id)

    def add_region(self, region):
        return self.region.add(region)

    def get_region_by_name(self, name):
        return self.region.get_by_name(name)

    def delete_region(self, region):
        return self.region.delete(region)