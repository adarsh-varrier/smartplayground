from apscheduler.schedulers.background import BackgroundScheduler
from .models import Booking  # Import your model
from datetime import datetime, timedelta
from django.utils.timezone import now
from holder.utils import send_notification

def send_playtime_alerts():
    """
    Sends a notification 2 hours before the playtime starts.
    """
    current_time = now()
    two_hours_later = current_time + timedelta(hours=2)

    upcoming_bookings = Booking.objects.filter(
        date=current_time.date(),
        time_slot__gte=current_time.time(),
        time_slot__lte=two_hours_later.time(),
        status="confirmed"  # Only notify for confirmed bookings
    )

    for booking in upcoming_bookings:
        message = f"Reminder: Your booking at '{booking.playground.name}' starts at {booking.time_slot}."
        send_notification(booking.user, message)

def start_scheduler2():
    """
    Starts the APScheduler background job.
    """
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_playtime_alerts, 'interval', minutes=15)  # Runs every minute
    scheduler.start()