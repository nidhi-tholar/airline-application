from flask import Flask
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from mongoengine import connect

from .api.aircraft_api import *
from .api.airport_api import airport_bp
from .api.booking_api import booking_bp
from .api.flight_api import flight_bp
from .api.seats_api import seat_bp
from .api.user_api import user_bp

app = Flask(__name__)
app.debug = False

app.config['SECRET_KEY'] = "airline_dev"

# app.config['MONGODB_SETTINGS'] = {
#     'db': 'airline_db',
#     'host': 'localhost', #$(DB_HOST)
#     'port': 27017
# }
DEFAULT_CONNECTION_NAME = connect(host="mongodb+srv://SaiK:Mongo01%21@clustertechies.sdi1q.mongodb.net/techiesDb?retryWrites=true&w=majority")

print("Backend running!")
#db = MongoEngine()

jwt = JWTManager()

#db.init_app(app)
jwt.init_app(app)

CORS(app)

blueprints = (user_bp, flight_bp, airport_bp, aircraft_bp, booking_bp, seat_bp)

for blueprint in blueprints:
    app.register_blueprint(blueprint)


@app.route('/')
def hello():
    return 'Airline App!'




