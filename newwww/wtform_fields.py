
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, EqualTo, ValidationError
from models import User
from passlib.hash import pbkdf2_sha256


def invalid_credentials(form, field):

    password_entered = field.data
    username_entered = form.username.data

    user_object = User.query.filter_by(username=username_entered).first()
    if user_object is None:
        raise ValidationError("Username or password is incorrect")

    elif not pbkdf2_sha256.verify(password_entered, user_object.password):
        raise ValidationError("Username or password is incorrect")



class RegistrationForm(FlaskForm):
    username = StringField('username_label',validators=[InputRequired(message="Username requires"), Length(min=4,max=25, message="4 to 5")])
    password = PasswordField('password_label',validators=[InputRequired(message="Password requires"), Length(min=4,max=25, message="4 to 5")])
    confirm_pswd = PasswordField('confirm_pswd_label',validators=[InputRequired(message="Password requires"),EqualTo('password', message="password must match")])
    submit_button = SubmitField('Create')

    def validate_username(self,username):
        user_object = User.query.filter_by(username=username.data).first()
        if user_object:
            raise ValidationError("already here")

class LoginForm(FlaskForm):
    username = StringField('username_label', validators=[InputRequired(message="username req")])
    password = StringField('password_label', validators=[InputRequired(message="Password req"), invalid_credentials])          
    submit_button = SubmitField('Create')
