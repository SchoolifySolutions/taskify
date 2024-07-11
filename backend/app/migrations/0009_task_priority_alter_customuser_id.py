# Generated by Django 4.2.14 on 2024-07-11 19:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_customuser_pfp_alter_customuser_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='priority',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='id',
            field=models.IntegerField(default=420366, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]
