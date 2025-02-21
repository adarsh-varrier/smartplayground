from django.apps import AppConfig
import threading

class HolderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'holder'
    
    def ready(self):
        import holder.signals
        from holder.scheduler import start_scheduler2
        start_scheduler2()