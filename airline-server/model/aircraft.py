from mongoengine import *
from model.base_document import BaseDocument


class Aircraft(BaseDocument):
    meta = {
        "collection": "Aircraft"
    }
    name = StringField(required=True)
    total_seats = IntField(required=True)
    seats = DictField(required=True, fields=['window', 'aisle', 'middle'])
    seat_chart = DictField(required=True, fields=['window', 'aisle', 'middle'])




