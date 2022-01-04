from model.booking import Booking


def update_flight_cancellation_in_bookings(flight_id, flight_status):
    try:
        bookings = Booking.objects(flight_oid=flight_id)
        for booking in bookings:
            booking.flight_status = flight_status
            booking.save()
    except:
        return None