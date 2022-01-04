from flask import request, jsonify, Blueprint, current_app as app
from flask_jwt_extended import jwt_required
from mongoengine import NotUniqueError

from api.aircraft_api import get_aircraft_details
from util.auth_util import admin_only
from util.cancellation import update_flight_cancellation_in_bookings
from model.flight import Flight
from util.error_codes import ErrorCodes


flight_bp = Blueprint('flight_bp', __name__)


@flight_bp.route('/flight', defaults={'id': None}, methods=['POST', 'GET', 'PUT'])
@flight_bp.route('/flight/<id>', methods=['GET'])


def flight(id):
    if request.method == 'POST':
        app.logger.info(f"Add flight API called")
        return add_flight()
    elif request.method == 'GET':
        return get_all_flights(id)
    else:
        return modify_flight()

@admin_only
@jwt_required()
def add_flight():
    data = request.get_json()
    try:
        aircraft = get_aircraft_details(data['aircraft'])
        flight_num = "AA" + data['flight_num']

        flight = Flight(flight_num=flight_num,
                        aircraft=data['aircraft'],
                        departure_airport=data['departure_airport'],
                        arrival_airport=data['arrival_airport'],
                        departure_date=data['departure_date'],
                        arrival_date=data['arrival_date'],
                        departure_time=data['departure_time'],
                        arrival_time=data['arrival_time'],
                        price=data['price'],
                        remaining_seats=aircraft.total_seats,
                        seats=aircraft.seats,
                        seat_chart=aircraft.seat_chart,
                        seat_price=data['seat_price']
                        )

        flight.save()

        message = "Flight - {} added successfully".format(data["flight_num"])
        app.logger.info(message)
        code = ErrorCodes.SUCCESS

    except NotUniqueError:
        message = "Flight Number already registered"
        app.logger.error(f"Error message is {message}")
        code = ErrorCodes.CONFLICT

    except Exception as error:
        app.logger.error(f"Error message is: {error}")
        message = "Something went wrong"
        code = ErrorCodes.INTERNAL_SERVER_ERROR

    return jsonify(message), code

# @jwt_required()
def get_all_flights(id):
    if not id:
        app.logger.info(f"Get flights API called")
        airport1 = request.args.get('airport1')
        airport2 = request.args.get('airport2')
        depart_date = request.args.get('depart_date')
        # return_date = request.args.get('return_date')

        try:
            res = []
            if airport1 is not None or airport2 is not None or depart_date is not None:
                flights = Flight.objects(departure_date=depart_date,
                                         departure_airport=airport1,
                                         arrival_airport=airport2,
                                         remaining_seats__gte=1,
                                         flight_status='scheduled'
                                         )

            else:
                flights = Flight.objects()

            for flight in flights:
                res.append(get_details_in_response(flight))

            code = ErrorCodes.SUCCESS

        except Exception as error:
            app.logger.error(f"Error message is: {error}")
            res = "Something went wrong"
            code = ErrorCodes.INTERNAL_SERVER_ERROR
        return jsonify(res), code

    else:
        app.logger.info("Get flight_by_ID API called")
        try:
            flight = get_flight_by_flight_id(id)
            if flight is None:
                message = "No such flight exists"
                app.logger.error(f"Error message is: {message}")
                return jsonify({'message': message}), ErrorCodes.INTERNAL_SERVER_ERROR

            flight_res = get_details_in_response(flight)

            return jsonify(flight_res), ErrorCodes.SUCCESS
        except Exception as error:
            app.logger.error(f"Error message is: {error}")
            return jsonify({'message': "Something went wrong"}), ErrorCodes.INTERNAL_SERVER_ERROR

@admin_only
@jwt_required()
def modify_flight():
    app.logger.info("Modify flight API called")
    data = request.get_json()
    try:
        flight = get_flight_by_flight_id(data['flight_id'])
        if flight is None:
            message = "No such flight exists"
            app.logger.error(f"Error message is: {message}")
            return jsonify({'message': message}), ErrorCodes.INTERNAL_SERVER_ERROR

        if 'price' in data.keys():
            flight.price = data['price']

        if 'flight_status' in data.keys():
            flight.flight_status = data['flight_status']

            # update user booking status!!
            update_flight_cancellation_in_bookings(flight.id, flight.flight_status)

        flight.save()

        return jsonify({'message': "Flight update successful"}), ErrorCodes.SUCCESS
    except Exception as error:
        app.logger.error(f"Error message is: {error}")
        return jsonify({'message': "Something went wrong"}), ErrorCodes.INTERNAL_SERVER_ERROR


def get_flight_by_flight_id(id):
    try:
        return Flight.objects.get(id=id)
    except:
        return None


def get_details_in_response(flight):
    flight_res = {}

    aircraft={}
    aircraft['name'] = flight.aircraft.name
    aircraft['id'] = str(flight.aircraft.id)
    flight_res['aircraft'] = aircraft

    arrival_airport = {}
    arrival_airport['id'] = str(flight.arrival_airport.id)
    arrival_airport['code'] = flight.arrival_airport.code
    arrival_airport['name'] = flight.arrival_airport.name
    arrival_airport['city'] = flight.arrival_airport.city
    flight_res['arrival_airport'] = arrival_airport

    departure_airport = {}
    departure_airport['id'] = str(flight.departure_airport.id)
    departure_airport['code'] = flight.departure_airport.code
    departure_airport['name'] = flight.departure_airport.name
    departure_airport['city'] = flight.departure_airport.city
    flight_res['departure_airport'] = departure_airport

    flight_res['id'] = str(flight.id)
    flight_res['arrival_date'] = flight.arrival_date
    flight_res['arrival_time'] = flight.arrival_time
    flight_res['departure_date'] = flight.departure_date
    flight_res['departure_time'] = flight.departure_time

    flight_res['flight_num'] = flight.flight_num
    flight_res['price'] = flight.price
    flight_res['remaining_seats'] = flight.remaining_seats
    flight_res['seats'] = flight.seats
    flight_res['seat_price'] = flight.seat_price
    flight_res['flight_status'] = flight.flight_status
    flight_res['seat_chart'] = flight.seat_chart



    # flight_res['aircraft_details'] = f"/aircraft/{flight.aircraft.id}"
    # flight_res['departure_airport_details'] = f"/airport/{flight.departure_airport.id}"
    # flight_res['arrival_airport_details'] = f"/airport/{flight.arrival_airport.id}"

    return flight_res