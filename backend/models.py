from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.declarative import declarative_base
# from wtforms import Form, StringField, PasswordField, validators
from sqlalchemy.orm import relationship, validates
from config import db
from sqlalchemy import JSON

employee_businesses = db.Table('employee_businesses', db.Model.metadata, #many to many
    db.Column('employee_id', db.Integer, db.ForeignKey('employees.id', ondelete='CASCADE', onupdate='CASCADE')),
    db.Column('business_id', db.Integer, db.ForeignKey('businesses.id', ondelete='CASCADE', onupdate='CASCADE'))
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String)

    def __init__(self, username, password):
        self.username = username
        self.password = password

# class UserForm(Form):
#     username = StringField('Username', [validators.Length(min=4, max=25)])
#     password = PasswordField('Password', [validators.Length(min=6)])
#     role = StringField('Role', [validators.Length(min=1, max=50)])

class ReportCharge(db.Model, SerializerMixin):
    __tablename__ = 'report_charges'
    report_id = db.Column(db.Integer, db.ForeignKey('reports.id', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
    charge_id = db.Column(db.Integer, db.ForeignKey('charges.id', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)

# class ProfileCharge(db.Model, SerializerMixin):
#     __tablename__ = 'profile_charges'
#     profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
#     charge_id = db.Column(db.Integer, db.ForeignKey('charges.id', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)


class Profile(db.Model, SerializerMixin):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String)
    csn = db.Column(db.String(8), unique=True)
    information = db.Column(db.Text)
    tags = db.Column(JSON, default=[])
    image = db.Column(db.Text)
    fingerprint = db.Column(db.String(50))
    licenses = db.Column(JSON, default=[])
    #relationships
    # charges = db.relationship('Charge', secondary=ProfileCharge.__table__, backref='profiles')

    @validates('csn')
    def validate_csn(self, key, value):
        if not (len(value) == 8 and value[:4].isalpha() and value[4:].isdigit()): #first 4 letters, last 4 num
            raise ValueError('CSN must have 4 letters followed by 4 numbers')
        return value


class Report(db.Model, SerializerMixin):
    __tablename__ = 'reports'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    body = db.Column(db.Text)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id', ondelete='SET NULL', onupdate='CASCADE'))
    #relationships
    # profile = db.relationship('Profile', backref='reports') #one to many

    @validates('title')
    def validate_title(self, key, value):
        if not value:
            raise ValueError('Title cannot be empty')
        return value

class Charge(db.Model, SerializerMixin):
    __tablename__ = 'charges'
    id = db.Column(db.Integer, primary_key=True)
    penal_title = db.Column(db.String)
    title = db.Column(db.String)
    category = db.Column(db.Text)
    code = db.Column(db.String)
    description = db.Column(db.Text)
    months = db.Column(db.Integer)
    fine = db.Column(db.Integer)
    points = db.Column(db.Integer)

    @validates('category')
    def validate_category(self, key, value):
        valid_categories = ["Felony", "Misdemeanor", "Infraction"]

        if value not in valid_categories:
            raise ValueError('Category must be Felony, Misdemeanor, or Infraction')
        return value

    @validates('months', 'fine', 'points')
    def validate_integer_fields(self, key, value):
        if not isinstance(value, int):
            raise ValueError(f'{key.capitalize()} must be an integer')
        return value

class Business(db.Model, SerializerMixin):
    __tablename__ = 'businesses'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    category = db.Column(db.Text)
    description = db.Column(db.Text)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id', ondelete='SET NULL', onupdate='CASCADE'))
    #relationships
    # profile = db.relationship('Profile', backref='businesses') #one to many

class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    position = db.Column(db.String)
