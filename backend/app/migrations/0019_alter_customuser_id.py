# Generated by Django 4.2.14 on 2024-07-15 22:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0018_alter_customuser_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='id',
            field=models.IntegerField(default=374975, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]
