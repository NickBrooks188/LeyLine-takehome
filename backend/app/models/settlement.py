from .db import db, environment, SCHEMA
from datetime import datetime

class Settlement(db.Model):
    __tablename__ = 'settlements'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'status': self.status
        }

