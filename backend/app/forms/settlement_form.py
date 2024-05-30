from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired

class SettlementForm(FlaskForm):
    status = StringField('status', validators=[DataRequired()])
    amount = IntegerField('amount', validators=[DataRequired()])
