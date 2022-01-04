from flask_mongoengine import BaseQuerySet
from mongoengine import *
import datetime


class BaseDocument(Document):
    meta = {
        'abstract': True,
        #'queryset_class': BaseQuerySet
    }
    modified_at = DateTimeField()
    modified_by = StringField()

    def save(self, *args, **kwargs):
        self.modified_at = datetime.datetime.now()
        return super(BaseDocument, self).save(*args, **kwargs)