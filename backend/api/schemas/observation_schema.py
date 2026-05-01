from marshmallow import fields
from app.extensions import ma, db
from api.entity.observation import Observation

class Observationschema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Observation
        load_instance = True
        include_fk = True
        sqla_session = db.session

    city_name = fields.Function(lambda obj: obj.city.name if obj.city else "Unknown City")
    crop_name = fields.Function(lambda obj: obj.crop.name if obj.crop else "Unknown Crop")
    region_name = fields.Function(lambda obj: obj.region.name if obj.region else "Unknown Region")