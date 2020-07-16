# Generated by Django 2.2 on 2019-10-09 18:19

import django.contrib.postgres.fields
from django.db import migrations, models
import json
import urllib


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    def populate_data(apps, schema_editor):
        College = apps.get_model('college', 'College')
        with urllib.request.urlopen(
                "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json") as json_file:
            data = json.load(json_file)
            for d in data:
                name = d['name']
                alpha_two_code = d['alpha_two_code']
                state_province = d['state-province']
                if state_province is None or state_province == 'null':
                    state_province = ''
                country = d['country']
                web_pages = []
                domains = []
                for w in d['web_pages']:
                    web_pages.append(w)
                for domain in d['domains']:
                    domains.append(domain)
                college = College.objects.create(web_pages=web_pages, domains=domains, name=name,
                                                 alpha_two_code=alpha_two_code, state_province=state_province,
                                                 country=country)
                college.save()
            jobhax = College.objects.create(web_pages=['https://jobhax.com'], domains=['jobhax.com'], name='JobHax', supported=True, state_province='CA')
            jobhax.save()

    operations = [
        migrations.CreateModel(
            name='College',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('web_pages', django.contrib.postgres.fields.ArrayField(base_field=models.TextField(blank=True, null=True), size=None)),
                ('domains', django.contrib.postgres.fields.ArrayField(base_field=models.TextField(blank=True, null=True), size=None)),
                ('name', models.CharField(max_length=200)),
                ('short_name', models.CharField(blank=True, max_length=10, null=True)),
                ('alpha_two_code', models.CharField(blank=True, max_length=5)),
                ('state_province', models.CharField(blank=True, max_length=30, null=True)),
                ('country', models.CharField(blank=True, max_length=50)),
                ('supported', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.RunPython(populate_data, reverse_code=migrations.RunPython.noop),
    ]
