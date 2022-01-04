from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from util.error_codes import ErrorCodes


def admin_only(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user = get_jwt_identity()
        if user['user_type'] != 'admin':
            return jsonify({'message': 'Admins only!'}), ErrorCodes.FORBIDDEN
        else:
            return fn(*args, **kwargs)

    return wrapper


