# Generated by Django 4.2.14 on 2024-07-11 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_task_priority_alter_customuser_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='department',
            field=models.ManyToManyField(blank=True, to='app.department'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='id',
            field=models.IntegerField(default=474658, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]
