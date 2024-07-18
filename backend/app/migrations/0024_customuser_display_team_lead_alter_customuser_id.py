# Generated by Django 4.2.14 on 2024-07-18 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0023_alter_customuser_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='display_team_lead',
            field=models.ManyToManyField(blank=True, related_name='display_team_leads', to='app.department'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='id',
            field=models.IntegerField(default=771576, primary_key=True, serialize=False, unique=True),
        ),
    ]
