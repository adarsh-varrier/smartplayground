# Generated by Django 5.1.1 on 2025-02-12 13:44

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('holder', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ticket_number', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('time_slot', models.TimeField()),
                ('date', models.DateField()),
                ('num_players', models.PositiveIntegerField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('rejected', 'Rejected')], default='pending', max_length=10)),
                ('playground', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='holder.playground')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
