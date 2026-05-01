from app.extensions import db


class City(db.Model):
    __tablename__ = 'cities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('regions.id'), nullable=False)


    region = db.relationship('Region', backref='cities', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'region_id': self.region_id,
            'region': self.region.name if self.region else "Bilinmeyen Bolge"
        }