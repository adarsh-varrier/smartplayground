# Generated by Django 5.1.1 on 2025-02-08 12:09

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Playground',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('location', models.CharField(max_length=255)),
                ('address', models.TextField()),
                ('time_slot_start', models.TimeField()),
                ('time_slot_end', models.TimeField()),
                ('num_players', models.IntegerField()),
                ('platform_type', models.CharField(choices=[('football', 'Football Ground'), ('cricket', 'Cricket Ground'), ('park', 'Children’s Park')], max_length=20)),
                ('image', models.ImageField(blank=True, null=True, upload_to='playground_images/')),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='playgrounds', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
