# Generated by Django 5.0.7 on 2024-07-15 18:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0016_alter_customuser_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='id',
            field=models.IntegerField(default=264106, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]
