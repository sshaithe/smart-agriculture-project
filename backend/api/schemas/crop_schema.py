from app.extensions import ma, db
from api.entity.crop import Crop

class Cropschema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Crop
        load_instance = True
        include_fk = True

