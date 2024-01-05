from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship
from config import db

employee_businesses = db.Table('employee_businesses', db.Model.metadata, #many to many
    db.Column('employee_id', db.Integer, db.ForeignKey('employees.id', ondelete='CASCADE', onupdate='CASCADE')),
    db.Column('business_id', db.Integer, db.ForeignKey('businesses.id', ondelete='CASCADE', onupdate='CASCADE'))
)

class Profile(db.Model, SerializerMixin):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    role = db.Column(db.String)

#add validation
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    role = db.Column(db.String)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id', ondelete='CASCADE', onupdate='CASCADE'))
    #relationships
    profile = db.relationship('Profile', backref='users') #one to many

class Report(db.Model, SerializerMixin):
    __tablename__ = 'reports'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    body = db.Column(db.Text)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id', ondelete='SET NULL', onupdate='CASCADE'))
    #relationships
    profile = db.relationship('Profile', backref='reports') #one to many

class Charge(db.Model, SerializerMixin):
    __tablename__ = 'charges'
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id', ondelete='SET NULL', onupdate='CASCADE'))
    title = db.Column(db.String)
    category = db.Column(db.Text)
    description = db.Column(db.Text)

class Business(db.Model, SerializerMixin):
    __tablename__ = 'businesses'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    category = db.Column(db.Text)
    description = db.Column(db.Text)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id', ondelete='SET NULL', onupdate='CASCADE'))
    #relationships
    profile = db.relationship('Profile', backref='businesses') #one to many

class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    position = db.Column(db.String)

class ReportCharge(db.Model, SerializerMixin):
    __tablename__ = 'report_charges'
    report_id = db.Column(db.Integer, db.ForeignKey('reports.id', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
    charge_id = db.Column(db.Integer, db.ForeignKey('charges.id', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
