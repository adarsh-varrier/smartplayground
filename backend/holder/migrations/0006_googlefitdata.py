# Generated by Django 5.1.1 on 2025-03-28 10:30

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('holder', '0005_playground_latitude_playground_longitude'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='GoogleFitData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('steps', models.IntegerField(blank=True, null=True)),
                ('calories_burned', models.FloatField(blank=True, null=True)),
                ('active_minutes', models.IntegerField(blank=True, null=True)),
                ('heart_rate', models.IntegerField(blank=True, null=True)),
                ('distance_moved', models.FloatField(blank=True, null=True)),
                ('move_minutes', models.IntegerField(blank=True, null=True)),
                ('weight', models.FloatField(blank=True, null=True)),
                ('height', models.FloatField(blank=True, null=True)),
                ('sleep_data', models.IntegerField(blank=True, null=True)),
                ('activity_sessions', models.IntegerField(blank=True, null=True)),
                ('recorded_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
