from app.extensions import db


class Region(db.Model):
    __tablename__ = 'regions'
    id      = db.Column(db.Integer, primary_key=True)
    name    = db.Column(db.String(120), unique=True, nullable=False, index=True)
    country = db.Column(db.String(120), default="Turkey")


    def to_dict(self):
        return {
            'id':      self.id,
            'name':    self.name,
            'country': self.country,
        }