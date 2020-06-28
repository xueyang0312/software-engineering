# Generated by Django 3.0 on 2020-06-26 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('advisor', '0003_record'),
    ]

    operations = [
        migrations.RenameField(
            model_name='record',
            old_name='group_id',
            new_name='group',
        ),
        migrations.RemoveField(
            model_name='record',
            name='user_id',
        ),
        migrations.AddField(
            model_name='record',
            name='username',
            field=models.CharField(default='a', max_length=30),
            preserve_default=False,
        ),
    ]