import json

from bson import json_util
from flask import request, jsonify, Blueprint, current_app as app, make_response
from flask_jwt_extended import jwt_required
from mongoengine import NotUniqueError

from model.airport import Airport
from util.auth_util import admin_only
from util.error_codes import ErrorCodes, JSONEncoder

airport_bp = Blueprint('airport_bp', __name__)


@airport_bp.route('/airport', defaults={'id': None}, methods=['POST', 'GET'])
@airport_bp.route('/airport/<id>', methods=['GET'])

@jwt_required()
def airport(id):
    if request.method == 'POST':
        app.logger.info("Add airport API called")
        return add_airport()
    else:
        return get_all_airports(id)

@admin_only
def add_airport():
    data = request.get_json()
    try:
        airport = Airport(code=data['code'],
                          name=data['name'],
                          city=data['city'])
        airport.save()
        message = "Airport - {} added successfully".format(data["code"])
        app.logger.info(message)
        code = ErrorCodes.SUCCESS

    except NotUniqueError:
        message = "Airport Code already registered"
        app.logger.error(f"Error message is: {message}")
        code = ErrorCodes.CONFLICT

    except Exception as error:
        app.logger.error(f"Error message is: {error}")
        message = "Something went wrong"
        code = ErrorCodes.INTERNAL_SERVER_ERROR

    return jsonify(message), code

@jwt_required()
def get_all_airports(id):
    try:
        if not id:
            app.logger.info("get_all_airports API called")
            airports = Airport.objects()
            res = []
            for airport in airports:
                temp = {}
                temp["id"] = str(airport.id)
                temp['code'] = airport.code
                temp['name'] = airport.name
                temp['city'] = airport.city
                res.append(temp)

            return jsonify(res), ErrorCodes.SUCCESS

        else:
            app.logger.info("Get airport_by_ID API called")
            airport = get_airport_by_id(id)
            temp = {}
            temp["id"] = str(airport.id)
            temp['code'] = airport.code
            temp['name'] = airport.name
            temp['city'] = airport.city
            return jsonify(temp), ErrorCodes.SUCCESS

    except Exception as error:
        app.logger.error(f"Error message is {error}")
        return jsonify({'message': "Something went wrong"}), ErrorCodes.INTERNAL_SERVER_ERROR


def get_airport_by_id(id):
    try:
        return Airport.objects.get(id=id)
    except:
        return None