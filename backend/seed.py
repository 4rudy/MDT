from faker import Faker
from faker_vehicle import VehicleProvider
from models import *
from config import app, db, Base
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from random import sample
import json
import string
import random

from charges import penal_code

fake = Faker()
fake.add_provider(VehicleProvider)

random_tags = [
    "DNA on File", "Gang Member", "Stolen Firearm", "Stolen Vehicle", "Weapon License Revoked", "Drivers License Suspended", "Life Sentence",
    "Grove Street Families", "Ballas", "Aztecas", "Vagos", "Marabunta Grande", "Lost MC", "Triads", "Wanted", "Warrant Served", "Street Racer"
]

random_licenses = [
    "Weapons", "Drivers", "Hunting", "Business", "Law", "Medical"
]

random_bis_categories = [
    "Business", "Law", "Medical", "Automotive Services", "Health and Wellness",
    "Technology Solutions", "Home Improvement", "Fashion and Apparel",
    "Food and Beverage", "Financial Services", "Travel and Tourism",
    "Fitness and Recreation", "Entertainment and Events",
    "Education and Training", "Real Estate and Property",
    "Legal Services", "Pet Care and Services",
    "Beauty and Personal Care", "Environmental Services",
    "Marketing and Advertising", "Art and Design",
    "Agriculture and Farming", "Home Decor and Furnishings"
]


def drop_all_tables():
    Base.metadata.drop_all(bind=db.engine)

def create_all_tables():
    Base.metadata.create_all(bind=db.engine)


def seed_profiles():
    with app.app_context():
        for _ in range(500):
            num_tags = fake.random_int(min=0, max=3)
            selected_tags = sample(random_tags, num_tags)
            num_licenses = fake.random_int(min=0, max=3)
            selected_licenses = sample(random_licenses, num_licenses)
            csn = ''.join(random.choices(string.ascii_uppercase, k=4)) + ''.join(random.choices(string.digits, k=4))  # 4 random letters, followed by 4 random numbers

            new_profile = Profile(
                name=fake.name(),
                csn=csn,
                information=fake.sentence(),
                tags=selected_tags,
                licenses=selected_licenses,
                image=fake.image_url(),
                fingerprint=fake.uuid4()
            )
            db.session.add(new_profile)
        db.session.commit()

def seed_charges():
    with app.app_context():
            for category, charges_list in penal_code.items():
                for charge_data in charges_list:
                    new_charge = Charge(
                        penal_title=category,
                        title=charge_data['title'],
                        category=charge_data['category'],
                        code=charge_data['id'],
                        description=charge_data['description'],
                        months=charge_data['months'],
                        fine=charge_data['fine'],
                        points=charge_data['points']
                    )
                    db.session.add(new_charge)
            db.session.commit()

def seed_vehicles():
    with app.app_context():
        for _ in range(500):
            machine_object_data = json.loads(json.dumps(fake.machine_object()))

            while True:
                profile_ids = [profile.id for profile in Profile.query.all()]
                random_characters = fake.random_elements(elements=('A', 'B', 'C', 'D', '0', '1', '2', '3'), length=8, unique=True)
                plate = ''.join(random_characters)
                random_profile_id = random.choice(profile_ids)

                new_vehicle = Vehicle(
                    make=machine_object_data["Make"],
                    model=machine_object_data["Model"],
                    year=machine_object_data["Year"],
                    color=fake.color_name(),
                    plate=plate,
                    profile_id=random_profile_id,
                )
                try:
                    db.session.add(new_vehicle)
                    db.session.commit()
                    break
                except IntegrityError:
                    db.session.rollback()

def seed_businesses():
    with app.app_context():
        for _ in range(500):
            random_category = random.choice(random_bis_categories)

            new_business = Business(
                name=fake.company(),
                category=random_category,
                about=fake.catch_phrase(),
            )
            db.session.add(new_business)
        db.session.commit()

from sqlalchemy.exc import IntegrityError


def seed_properties():
    with app.app_context():
        for _ in range(500):
            profile = Profile.query.order_by(func.random()).first()
            business = Business.query.order_by(func.random()).first()

            if profile is None or business is None:
                continue

            new_property = Property(
                address=fake.address(),
                zipcode=fake.zipcode(),
                profile_id=profile.id,
                business_id=business.id
            )

            db.session.add(new_property)

            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()


if __name__ == "__main__":
    # drop_all_tables()
    # create_all_tables()
    seed_profiles()
    seed_charges()
    seed_vehicles()
    seed_businesses()
    seed_properties()
