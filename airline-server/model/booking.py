from mongoengine import *
from model.base_document import BaseDocument
from model.flight import Flight
from model.user import User


class Booking(BaseDocument):
    meta = {
        "collection": "booking"
    }
    booking_num = StringField(required=True)
    flight_oid = ReferenceField(Flight, required=True)
    customer_oid = ReferenceField(User, required=True)
    seat_num = StringField()
    seat_type = StringField()
    mileage_points_earned = FloatField(required=True)
    booking_history = StringField(required=True, default='booked', choices=['booked', 'changed', 'canceled'])
    booked_price = FloatField(required=True)
    seat_price = FloatField()
    traveller_details = DictField(required=True)
    flight_status = StringField(required=True)
    payment = DictField(required=True)

# fields=['cash', 'reward_points_used']
