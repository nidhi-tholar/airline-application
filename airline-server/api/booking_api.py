import random
import string

from flask import request, jsonify, Blueprint,  current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from model.booking import Booking
from util.error_codes import ErrorCodes
from util.mileage_rewards import calculate_mileage_points
from api.user_api import get_user_by_email

from api.flight_api import get_flight_by_flight_id, get_details_in_response

booking_bp = Blueprint('booking_bp', __name__)


@booking_bp.route('/booking', defaults={'b_id': None}, methods=['POST', 'GET', 'PUT'])
@booking_bp.route('/booking/<b_id>', methods=['GET', 'DELETE'])

@jwt_required()
def booking(b_id):
    if request.method == 'POST':
        app.logger.info(f"Make a Booking API called")
        return make_a_booking()

    if request.method == 'GET':
        try:
            user_jwt = get_jwt_identity()
            user = get_user_by_email(user_jwt['user'])

            if not b_id:
                app.logger.info(f"Get Bookings of Customer API called")
                res = []
                bookings = Booking.objects(customer_oid=user.id)
                for booking in bookings:
                    res.append(get_booking_details_in_response(booking))
                return jsonify(res), ErrorCodes.SUCCESS
            else:
                app.logger.info(f"Get Booking by ID API called")
                booking = get_booking_by_id(b_id)
                booking_res = get_booking_details_in_response(booking)
                return jsonify(booking_res), ErrorCodes.SUCCESS

        except Exception as error:
            app.logger.error(f"Error message is: {error}")
            return jsonify({'message': "Something went wrong"}), ErrorCodes.INTERNAL_SERVER_ERROR

    # cancel reservation
    if request.method == 'DELETE':
        try:
            booking = get_booking_by_id(b_id)
            if not booking:
                app.logger.error("Booking not found")
                return jsonify({'message': "Booking not found"}), ErrorCodes.BAD_REQUEST

            elif booking.booking_history == 'canceled':
                app.logger.error("Booking is already canceled")
                return jsonify({'message': "Booking is already canceled"}), ErrorCodes.BAD_REQUEST
            else:
                booking.booking_history = 'canceled'
                # increasing flight seats
                booking.flight_oid.remaining_seats += 1
                if 'seat' in booking:
                    if booking.seat in ['window', 'aisle', 'middle']:
                        booking.flight_oid.seats[booking.seat] += 1



                booking.mileage_points_earned = 0
                booking.save()
                booking.flight_oid.save()

                user_jwt = get_jwt_identity()
                user = get_user_by_email(user_jwt['user'])
                user.mileage_points -= booking.mileage_points_earned  # taking back booking rewards
                # refund
                refund = (booking.payment['reward_points_used'] * 0.7) + (booking.payment['cash'] * 0.7)
                user.mileage_points += refund
                user.save()

                message = f'Booking {booking.booking_num} canceled successfully. {refund} points have been added to your rewards as per refund policy'
                app.logger.info(message)
                return jsonify({'message': message}), ErrorCodes.SUCCESS

        except Exception as error:
            app.logger.error(f"Error message is: {error}")
            return jsonify({'message': "Something went wrong"}), ErrorCodes.INTERNAL_SERVER_ERROR

    # change reservation
    if request.method == 'PUT':
        app.logger.info("Change Booking API called")
        data = request.get_json()
        try:
            booking = get_booking_by_id(data['booking_id'])
            if not booking:
                app.logger.error("Booking not found")
                return jsonify({'message': "Booking not found"}), ErrorCodes.BAD_REQUEST

            elif booking.booking_history == 'changed':
                app.logger.error("Booking is already changed!!")
                return jsonify({'message': "You can change the Booking only once!!"}), ErrorCodes.BAD_REQUEST

            elif booking.booking_history == 'canceled':
                app.logger.error("Booking is already canceled!!")
                return jsonify({'message': "Booking is already canceled!!"}), ErrorCodes.BAD_REQUEST

            else:
                booking.booking_history = 'changed'

                # increasing flight seats
                booking.flight_oid.remaining_seats += 1
                if 'seat' in booking:
                    if booking.seat in ['window', 'aisle', 'middle']:
                        booking.flight_oid.seats[booking.seat] += 1

                booking.save()
                booking.flight_oid.save()

                # taking back booking rewards
                user_jwt = get_jwt_identity()
                user = get_user_by_email(user_jwt['user'])
                user.mileage_points -= booking.mileage_points_earned
                user.save()

                # new booking!!
                res, code = make_a_booking(booking.booking_num)

                # price changes-- frontend

                message = f'Booking {booking.booking_num} changed successfully'
                app.logger.info(message)
                return jsonify({'message': message, 'booking': str(booking.id)}), ErrorCodes.SUCCESS

        except Exception as error:
            print(error)
            return jsonify({'message': "Something went wrong"}), ErrorCodes.INTERNAL_SERVER_ERROR


def get_booking_by_id(b_id):
    print(b_id)
    try:
        return Booking.objects.get(id=b_id)
    except:
        return None


def make_a_booking(booking_num=None):
    app.logger.info("Book a Flight API called")
    data = request.get_json()
    try:
        user_jwt = get_jwt_identity()
        user = get_user_by_email(user_jwt['user'])

        flight = get_flight_by_flight_id(data['flight_oid'])

        if flight is None:
            message = "No such Flight exists"
            app.logger.error(message)
            return jsonify({'message': message}), ErrorCodes.BAD_REQUEST

        if flight.flight_status =='canceled':
            message = "Sorry! This Flight is canceled"
            app.logger.error(message)
            return jsonify({'message': message}), ErrorCodes.BAD_REQUEST

        if flight.remaining_seats == 0:
            message = "Flight is full"
            app.logger.error(message)
            return jsonify({'message': message}), ErrorCodes.BAD_REQUEST

        if data['payment']['reward_points_used'] > user.mileage_points:
            message = "Error!! Not enough rewards points"
            app.logger.error(message)
            return jsonify({'message': message}), ErrorCodes.CONFLICT

        if data['payment']['reward_points_used'] + data['payment']['cash'] != flight.price:
            message = "Error in Payment!!"
            app.logger.error(message)
            return jsonify({'message': message}), ErrorCodes.BAD_REQUEST

        flight.remaining_seats -= 1  # if more seats, change this
        flight.save()

        if booking_num is None:
            booking_num = "#" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))

        booking = Booking(booking_num=booking_num,
                          flight_oid=flight.id,
                          customer_oid=user.id,
                          booked_price=flight.price,
                          mileage_points_earned=calculate_mileage_points(data['payment']['cash']),
                          flight_status=flight.flight_status,
                          traveller_details=data['traveler_details'],
                          payment=data['payment'])
        booking.save()

        user.mileage_points -= data['payment']['reward_points_used']
        user.mileage_points += booking.mileage_points_earned
        user.save()

        app.logger.info("Booking successful")
        return jsonify({'message': "Booking successful", "booking": str(booking.id)}), ErrorCodes.SUCCESS

    except Exception as error:
        app.logger.error(f"Error message is: {error}")
        return jsonify({'message': "Something went wrong"}), ErrorCodes.INTERNAL_SERVER_ERROR


def get_booking_details_in_response(booking):
    booking_res = {}
    booking_res['id'] = str(booking.id)
    booking_res['booking_num'] = booking.booking_num
    booking_res['mileage_points_earned'] = booking.mileage_points_earned
    booking_res['booking_history'] = booking.booking_history
    booking_res['booked_price'] = booking.booked_price
    booking_res['traveller_details'] = booking.traveller_details
    booking_res['flight_status'] = booking.flight_status
    booking_res['payment'] = booking.payment
    booking_res['seat_num'] = booking.seat_num
    booking_res['seat_price'] = booking.seat_price
    booking_res['seat_type'] = booking.seat_type
    booking_res['flight_oid'] = get_details_in_response(booking.flight_oid)

    return booking_res