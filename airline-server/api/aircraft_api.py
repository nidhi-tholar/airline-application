from flask import jsonify, Blueprint, current_app as app
from flask_jwt_extended import jwt_required

from model.aircraft import Aircraft
from util.auth_util import admin_only
from util.error_codes import ErrorCodes


aircraft_bp = Blueprint('aircraft_bp', __name__)


@aircraft_bp.route('/aircraft', defaults={'id': None}, methods=['GET'])
@aircraft_bp.route('/aircraft/<id>', methods=['GET'])


@admin_only
@jwt_required()
def aircraft(id):
    try:
        if not id:
            app.logger.info("Get aircraft API called")
            aircrafts = Aircraft.objects()
            res = []
            for aircraft in aircrafts:
                temp = {}
                temp["id"] = str(aircraft.id)
                temp['total_seats'] = aircraft.total_seats
                temp['name'] = aircraft.name
                temp['seat_chart'] = aircraft.seat_chart
                res.append(temp)

            return jsonify(res), ErrorCodes.SUCCESS
        else:

            app.logger.info("Get aircraft_by_id API called")
            aircraft = get_aircraft_details(id)
            temp = {}
            temp["id"] = str(aircraft.id)
            temp['total_seats'] = aircraft.total_seats
            temp['name'] = aircraft.name
            temp['seat_chart'] = aircraft.seat_chart
            return jsonify(temp), ErrorCodes.SUCCESS

    except Exception as error:
        app.logger.error(f"Error message is {error}")
        return jsonify({'message': "Something went wrong"}), ErrorCodes.INTERNAL_SERVER_ERROR


def get_aircraft_details(id):
    try:
        return Aircraft.objects.get(id=id)

    except:
        return None
