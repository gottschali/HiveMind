from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired


class LoginForm(FlaskForm):
    roomname = StringField("Name", validators=[DataRequired()])
    submit = SubmitField("Create room")
