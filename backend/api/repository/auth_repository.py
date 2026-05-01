from ..entity.user import User
from app.extensions import db

class UserRepository:
    def find_by_email(self, email: str):
        return User.query.filter_by(email=email).first()

    def find_by_id(self, user_id: int):
        return User.query.get(user_id)

    def save(self, user: User):
        db.session.add(user)
        db.session.commit()
        return user