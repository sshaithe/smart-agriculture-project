from app.extensions import ma
from api.entity.region import Region

class RegionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Region
        load_instance = True