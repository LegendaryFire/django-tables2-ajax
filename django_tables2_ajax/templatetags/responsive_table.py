from django import template
from django.urls import reverse

register = template.Library()


@register.simple_tag(takes_context=True)
def responsive_table(context, table_id, url, *args, table_template='django_tables2_ajax/table.html', **kwargs):
    table_template = template.loader.get_template(table_template)
    context.push(table_url=reverse(url, args=args, kwargs=kwargs), table_id=table_id)
    return table_template.render(context.flatten())
