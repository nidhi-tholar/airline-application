from flask import request, jsonify, Blueprint,  current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity


from api.booking_api import get_booking_by_id
from util.error_codes import ErrorCodes

seat_bp = Blueprint('seat_bp', __name__)


@seat_bp.route('/booking/purchase_seat', defaults={'id': None}, methods=['POST'])
@seat_bp.route('/booking/purchase_seat/<id>', methods=['GET'])


@jwt_required()
def purchase_seat(id):
    if request.method == 'POST':
        app.logger.info("Purchase Seat API called")
        data = request.get_json()
        try:
            booking = get_booking_by_id(data['booking_id'])
            seat_type = data['seat_type']
            seat_num = data['seat_num']

            if booking.seat_type not in ['window', 'aisle', 'middle']:
                if booking.flight_oid.seats[seat_type] == 0:
                    return jsonify(
                        {'message': f"All {seat_type} seats are taken"}), ErrorCodes.BAD_REQUEST

                booking.flight_oid.seats[seat_type] -= 1
                (booking.flight_oid.seat_chart[seat_type]).remove(seat_num)
                booking.flight_oid.save()

                booking.seat_type = seat_type
                booking.seat_price = booking.flight_oid.seat_price[seat_type]
                booking.seat_num = seat_num
                booking.save()

                return jsonify({'booking': str(booking.id), 'message': "Seat Purchase successful!"}), ErrorCodes.SUCCESS
            else:
                return jsonify({'message': "You have already booked a seat for this flight!!"}), ErrorCodes.BAD_REQUEST

        except Exception as error:
            app.logger.error(f"Error message is {error}")
            return jsonify({'message': "Something went wrong"}), ErrorCodes.INTERNAL_SERVER_ERROR

    if request.method == 'GET':
        try:
            app.logger.info("Get seats API called")
            booking = get_booking_by_id(id)
            if booking is None:
                message = "No such booking exists"
                app.logger.error(f"Error message is: {message}")
                return jsonify({'message': message}), ErrorCodes.INTERNAL_SERVER_ERROR

            res = {"num_of_seats": booking.flight_oid.seats,
                   "price": booking.flight_oid.seat_price,
                   "seat_num": booking.flight_oid.seat_chart}
            return jsonify(res), ErrorCodes.SUCCESS
        except Exception as error:
            app.logger.error(f"Error message is {error}")
            return jsonify({'message': "Something went wrong"}), ErrorCodes.INTERNAL_SERVER_ERROR
