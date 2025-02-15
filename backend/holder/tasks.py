def start_scheduler():
    from holder.scheduler import delete_expired_bookings  # Import only the function, not start_scheduler
    from apscheduler.schedulers.background import BackgroundScheduler

    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_expired_bookings, 'interval', hours=6)  # Run once a day
    print("[DEBUG] Scheduler is now starting...")
    scheduler.start()


