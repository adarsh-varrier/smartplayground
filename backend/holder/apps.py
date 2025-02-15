from django.apps import AppConfig
import threading

class HolderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'holder'
    
    def ready(self):
        from holder.tasks import start_scheduler  # ✅ Import only from tasks.py
        thread = threading.Thread(target=start_scheduler, daemon=True)  
        thread.start()  # Run scheduler in a separate thread