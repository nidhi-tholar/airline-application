from mongoengine import *
from model.base_document import BaseDocument


class Airport(BaseDocument):
    meta = {
        "collection": "Airport"
    }
    code = StringField(required=True, unique=True)
    name = StringField(required=True)
    city = StringField(required=True)
