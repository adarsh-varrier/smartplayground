from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from .models import Booking  # Import your model

def delete_expired_bookings():
    """Delete expired bookings from the database."""
    now = datetime.now().date()  # Get current date
        # Also delete today's bookings if their time has already passed
    expired_today_count, _ = Booking.objects.filter(
        date=now.date(),  # Match today's date
        time_slot__lt=now.time()  # Match time earlier than now
    ).delete()
    print(f"[Scheduler] Deleted {expired_today_count} expired bookings at {datetime.now()}")

