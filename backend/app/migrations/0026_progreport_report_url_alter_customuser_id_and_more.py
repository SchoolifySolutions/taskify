# Generated by Django 5.0.7 on 2024-08-08 23:48

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0025_alter_customuser_id_progreport'),
    ]

    operations = [
        migrations.AddField(
            model_name='progreport',
            name='report_url',
            field=models.URLField(default='https://drive.google.com'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='customuser',
            name='id',
            field=models.IntegerField(default=519977, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='progreport',
            name='date_submitted',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
        migrations.AlterField(
            model_name='progreport',
            name='task',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='task', to='app.task', verbose_name='task'),
        ),
    ]