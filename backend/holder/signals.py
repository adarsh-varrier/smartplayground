from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Playground, Booking
from .utils import send_notification

@receiver(post_save, sender=Playground)
def notify_owner_on_creation(sender, instance, created, **kwargs):
    if created:
        message = f"Your playground '{instance.name}' has been successfully added."
        send_notification(instance.owner, message)

@receiver(post_save, sender=Booking)
def notify_owner_on_booking(sender, instance, created, **kwargs):
    if created:
        message = f"New booking received for '{instance.playground.name}' on {instance.date} at {instance.time_slot}."
        send_notification(instance.playground.owner, message)

@receiver(post_save, sender=Booking)
def notify_user_on_booking(sender, instance, created, **kwargs):
    if created:
        message = f"Your booking for '{instance.playground.name}' on {instance.date} at {instance.time_slot} is confirmed. Ticket Number: {instance.ticket_number}."
        send_notification(instance.user, message)
