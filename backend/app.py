from flask import Flask, jsonify
from flask import request, make_response, jsonify
from flask_restful import Resource
from config import app, db, api
from models import *

app = Flask(__name__)

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)

class Login(Resource):
    def get(self):
        user = User.query.filter(
            User.username == request.get_json()['username'],
        ).first()
        db.session['user_id'] = user.id
        return user.to_dict()
    
    def post(self):
        pass

api.add_resource(Login, '/login')
