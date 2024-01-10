from faker import Faker
from models import Profile, Charge
from config import app, db
from random import sample
import json
import string
import random

from charges import penal_code

fake = Faker()

random_tags = [
    "DNA on File", "Gang Member", "Stolen Firearm", "Stolen Vehicle", "Weapon License Revoked", "Drivers License Suspended", "Life Sentence",
    "Grove Street Families", "Ballas", "Aztecas", "Vagos", "Marabunta Grande", "Lost MC", "Triads", "Wanted", "Warrant Served", "Street Racer"
]

random_licenses = [
    "Weapons", "Drivers", "Hunting", "Business", "Law", "Medical"
]

def generate_random_data():
    with app.app_context():
        for _ in range(500):
            num_tags = fake.random_int(min=0, max=3)
            selected_tags = sample(random_tags, num_tags)
            num_licenses = fake.random_int(min=0, max=3)
            selected_licenses = sample(random_licenses, num_licenses)
            csn = ''.join(random.choices(string.ascii_uppercase, k=4)) + ''.join(random.choices(string.digits, k=4)) #4 random letters, follwed by 4 random numbers

            new_profile = Profile(
                name=fake.name(),
                csn=csn,
                information=fake.sentence(),
                tags=selected_tags,
                licenses = selected_licenses,
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

if __name__ == "__main__":
    # pass
    seed_charges()
    generate_random_data()
