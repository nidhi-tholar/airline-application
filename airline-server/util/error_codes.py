

class ErrorCodes:
    SUCCESS = 200
    INTERNAL_SERVER_ERROR = 500
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    NOT_FOUND = 404
    CONFLICT = 409
    FORBIDDEN = 403

import json
from bson import ObjectId

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        o = o.id
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)




