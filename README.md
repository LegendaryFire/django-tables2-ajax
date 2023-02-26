
# django_tables2_ajax

This project is intended to provide added functionality to the already outstanding [django_tables2](https://github.com/jieter/django-tables2) library, inspired & based off of [django-ajax-tables](https://github.com/KiwiTrinsic/django-ajax-tables). Using this package, you'll be able to easily implement responsive full-text search capabilities, pagination and more.

See project on [GitHub](https://github.com/LegendaryFire/django-tables2-ajax).

## Installation

This can be installed using pip by following the steps below.

In your Python environment, install django_tables2_ajax.

```
pip install django_tables2_ajax
```

Add the following to your projects *INSTALLED_APPS* variable found in *settings.py* so it looks as such.

```
INSTALLED_APPS = [
    'django_tables2',
    'django_tables2_ajax',
]
```

From there, we can begin by adding a table class in a new file named *tables.py* located in your apps directory, as we would with [django_tables2](https://django-tables2.readthedocs.io/en/latest/pages/tutorial.html).

```
class PersonTable(tables.Table):
    class Meta:
        model = Person
        template_name = "django_tables2/bootstrap.html"
        fields = ("name", )
```

Once we've made our table class, we can add a function in our apps *views.py* file to handle AJAX requests for table data. You will find below a function named *build_filter*, however this mainly intended for development purposes, and a more efficient full-text search algorithm should be used for production.
```
def build_filter(search, *args, **kwargs):
    """
    Builds a search filter given the search parameters & search text.
    Use like a regular filter, except set any values you want searched set to True.
    """
    children = [*args, *sorted(kwargs.items())]
    search_keywords = search.split()
    search_filter = Q(_connector="AND")
    for keyword in search_keywords:
        current_filter = Q(_connector="OR")
        for (key, value) in children:
            if value is True:
                current_filter.children.append((key, keyword))
        search_filter.children.append(current_filter)
    return search_filter


def table_person(request):
    # Get the search query, if it exists.
    search = request.GET.get("search")
    # Check to see if the search query exists.
    if search:
        # Search for specified fields, etc.
        search_filter = build_filter(search, first_name__icontains=True, last_name__icontains=True)
        table = PersonTable(Person.objects.filter(search_filter))
    else:
        table = PersonTable(Person.objects.all())

    RequestConfig(request).configure(table)
    return HttpResponse(table.as_html(request))
```

From there, we must add a URL pattern so the table can fetch the tables contents, and update the table contents when something is searched, or a page is changed. In our apps *urls.py* file, we can add the following URL routing.

```
path('table-person/', views.table_person, name="TablePerson")
```

Now that we have our table requests, search handling & URL routing finished, we can begin to implement it into one of our views templates. There is nothing needed in the context of the view you want the table on, the only thing that is required for having the table appear on your page is to have it implemented into your views template.

Inside the template of the view you'd like the table to appear, add the following script to the bottom of the body tag, or to the head tag.

```
<script src="{% static 'django_tables2_ajax/tables.js' %}" type="application/javascript"></script>
```

Then, wherever you would like the table to show on your template, insert the table as such. The first argument is the HTML ID of the table & related objects. This can be anything you'd like however if there are multiple tables on your page these must be different. The second argument is the URL pattern we created for handling the AJAX requests.

```
{% responsive_table "myTableID" "example:TablePerson" %}
```

All done! From there we can add as many more tables to our template as we please.
