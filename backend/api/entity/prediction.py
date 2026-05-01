import json
from app.extensions import db


class Prediction(db.Model):
  
    __tablename__ = 'predictions'

    id              = db.Column(db.Integer, primary_key=True)
    user_id         = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    prediction_type = db.Column(db.String(20), nullable=False)   
    input_data      = db.Column(db.Text, nullable=True)         
    result_data     = db.Column(db.Text, nullable=True)        
    created_at      = db.Column(db.DateTime, default=db.func.current_timestamp())

   
    user = db.relationship('User', backref='predictions', lazy=True)

  
    def set_input(self, data: dict):
        self.input_data = json.dumps(data)

    def set_result(self, data: dict):
        self.result_data = json.dumps(data)

    def get_input(self) -> dict:
        return json.loads(self.input_data) if self.input_data else {}

    def get_result(self) -> dict:
        return json.loads(self.result_data) if self.result_data else {}

    def to_dict(self):
        return {
            "id":               self.id,
            "user_id":          self.user_id,
            "prediction_type":  self.prediction_type,
            "input":            self.get_input(),
            "result":           self.get_result(),
            "created_at":       self.created_at.strftime("%Y-%m-%d %H:%M") if self.created_at else None,
        }