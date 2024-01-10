from flask import request, make_response, jsonify
from flask_restful import Resource
from config import app, db, api
from models import *

class Login(Resource):
    def get(self):
        username = request.args.get('username')
        password = request.args.get('password')

        if not username or not password:
            response = make_response(jsonify({'error': 'Username or password not provided'}), 400)
        else:
            user = User.query.filter_by(username=username).first()

            if not user or not user.check_password(password):
                response = make_response(jsonify({'error': 'Invalid username or password'}), 401)
            else:
                db.session['user_id'] = user.id
                response = make_response(jsonify(user.to_dict()), 200)
        return response

    def post(self):
        data = request.get_json()
        form = UserForm(data=data)
        if form.validate():
            new_user = User(username=form.username.data,
                            password=form.password.data,
                            role=form.role.data,
                            profile_id=form.profile_id.data)
            db.session.add(new_user)
            db.session.commit()

            response = make_response(jsonify({'message': 'User created successfully'}), 201)
        else:
            response = make_response(jsonify({'error': form.errors}), 400)
        return response
api.add_resource(Login, '/login')


class SingleProfile(Resource):
    def get(self, profile_id):
        profile = Profile.query.get(profile_id)

        if not profile:
            response = make_response(jsonify({'error': 'Profile not found'}), 404)
        else:
            response = make_response(jsonify(profile.to_dict()), 200)
        return response

    def delete(self, profile_id):
        profile = Profile.query.get(profile_id)

        if not profile:
            response = make_response(jsonify({'error': 'Profile not found'}), 404)
        else:
            db.session.delete(profile)
            db.session.commit()

            response = make_response(jsonify({'message': 'Profile deleted'}), 200)
        return response

    def patch(self, profile_id):
        profile = Profile.query.get(profile_id)

        if not profile:
            response = make_response(jsonify({'error': 'Profile not found'}), 404)
        else:
            data = request.get_json()
            profile.name = data.get('name', profile.name) #either use new name or use default name
            profile.ssn = data.get('ssn', profile.ssn)
            profile.information = data.get('information', profile.information)
            profile.tags = data.get('tags', profile.tags)
            profile.image = data.get('image', profile.image)
            profile.fingerprint = data.get('fingerprint', profile.fingerprint)
            profile.licenses = data.get('licenses', profile.licenses)

            db.session.commit()

            response = make_response(jsonify({'message': 'Profile updated successfully'}), 200)
        return response
api.add_resource(SingleProfile, '/profiles/<int:profile_id>')


class AllProfiles(Resource):
    def get(self):
        profiles = Profile.query.all()
        profiles_list = [profile.to_dict() for profile in profiles]

        return make_response(profiles_list, 200)

    def post(self):
        data = request.get_json()
        new_profile = Profile(
            name=data.get('name'),
            ssn=data.get('ssn'),
            information=data.get('information'),
            tags=data.get('tags', []),
            image=data.get('image'),
            fingerprint=data.get('fingerprint'),
            licenses=data.get('licenses', [])
        )

        db.session.add(new_profile)
        db.session.commit()

        response = make_response(jsonify({'message': 'Profile created'}), 201)
        return response
api.add_resource(AllProfiles, '/profiles')


class SingleCharge(Resource):
    def get(self, charge_id):
        charge = Charge.query.get(charge_id)

        if not charge:
            response = make_response(jsonify({'error': 'Charge not found'}), 404)
        else:
            response = make_response(jsonify(charge.to_dict()), 200)
        return response

    def patch(self, charge_id):
        charge = Charge.query.get(charge_id)

        if not charge:
            response = make_response(jsonify({'error': 'Charge not found'}), 404)
        else:
            data = request.get_json()
            charge.penal_title = data.get('penal_title', charge.penal_title)
            charge.title = data.get('title', charge.title)
            charge.category = data.get('category', charge.category)
            charge.code = data.get('code', charge.code)
            charge.description = data.get('description', charge.description)
            charge.months = data.get('months', charge.months)
            charge.fine = data.get('fine', charge.fine)
            charge.points = data.get('points', charge.points)

            db.session.commit()

            response = make_response(jsonify({'message': 'Charge updated successfully'}), 200)
        return response

    def delete(self, charge_id):
        charge = Charge.query.get(charge_id)

        if not charge:
            response = make_response(jsonify({'error': 'Charge not found'}), 404)
        else:
            db.session.delete(charge)
            db.session.commit()

            response = make_response(jsonify({'message': 'Charge deleted successfully'}), 200)
        return response
api.add_resource(SingleCharge, '/charges/<int:charge_id>')

class AllCharges(Resource):
    def get(self):
        charges = Charge.query.all()
        charges_list = [charge.to_dict() for charge in charges]

        return jsonify(charges_list)

    def post(self):
        data = request.get_json()
        new_charge = Charge(
            penal_title=data.get('penal_title'),
            title=data.get('title'),
            category=data.get('category'),
            code=data.get('code'),
            description=data.get('description'),
            months=data.get('months'),
            fine=data.get('fine'),
            points=data.get('points')
        )

        db.session.add(new_charge)
        db.session.commit()

        response = make_response(jsonify({'message': 'Charge created successfully'}), 201)
        return response
api.add_resource(AllCharges, '/charges')


@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)
