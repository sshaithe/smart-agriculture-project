from app.extensions import db


class User(db.Model):
    __tablename__ = 'users'
    id       = db.Column(db.Integer, primary_key=True)
    email    = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(128), nullable=False)
    username = db.Column(db.String(80),  nullable=True)

    def to_dict(self):
        return {
            'id':       self.id,
            'email':    self.email,
            'username': self.username,
            
        }