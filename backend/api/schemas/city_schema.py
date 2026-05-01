from app.extensions import ma
from api.entity.city import City

class CitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = City
        load_instance = True
        include_fk = True

        region = ma.Function(lambda obj: obj.region.name if obj.region else None)