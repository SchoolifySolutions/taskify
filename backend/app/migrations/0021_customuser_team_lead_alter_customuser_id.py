# Generated by Django 4.2.14 on 2024-07-15 23:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0020_alter_customuser_id_alter_task_task_due_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='team_lead',
            field=models.ManyToManyField(blank=True, related_name='team_leads', to='app.department'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='id',
            field=models.IntegerField(default=829243, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]