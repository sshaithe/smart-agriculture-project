from app.extensions import db

class Observation(db.Model):
    __tablename__ = 'observations'
    id = db.Column(db.Integer, primary_key=True)
    region_id = db.Column(db.Integer, db.ForeignKey('regions.id'), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)

    city = db.relationship('City', backref='city_observations', lazy=True)
    crop = db.relationship('Crop', backref='crop_observations', lazy=True)
    region = db.relationship('Region', backref='region_observations', lazy=True)

    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    year = db.Column(db.Integer)

    t2m = db.Column(db.Float)
    t2m_max = db.Column(db.Float)
    t2m_min = db.Column(db.Float)
    rh2m = db.Column(db.Float)
    prectotcorr = db.Column(db.Float)
    ws2m = db.Column(db.Float)
    allsky_sfc_sw_dwn = db.Column(db.Float)

    soil_temp_0_7 = db.Column(db.Float, nullable=True)
    soil_temp_7_28 = db.Column(db.Float, nullable=True)
    soil_moisture_0_7 = db.Column(db.Float, nullable=True)
    soil_moisture_7_28 = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            "city_id": self.city_id,
            "crop_id": self.crop_id,
            "city": self.city.name if self.city else "Unknown City",
            "region": self.region.name if self.region else "Unknown Region",
            "crop": self.crop.name if self.crop else "Unknown Crop",
            "year": self.year,
            "weather": {
                "temp": self.t2m,
                "temp_max": self.t2m_max,
                "temp_min": self.t2m_min,
                "humidity": self.rh2m,
                "rain": self.prectotcorr,
                "wind_speed": self.ws2m,
                "solar": self.allsky_sfc_sw_dwn
            },
            "soil": {
                "moisture": self.soil_moisture_0_7,
                "temp": self.soil_temp_0_7,
                "moisture_deep": self.soil_moisture_7_28,
                "temp_deep": self.soil_temp_7_28
            }
        }