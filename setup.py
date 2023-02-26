import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="django_tables2_ajax",
    version="1.0",
    author="Tristan Balon",
    description="django-tables2 but with AJAX searching.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/LegendaryFire/django-tables2-ajax",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[
        "Programming Language :: Python :: 3",
        "Framework :: Django :: 3.0",
        "Environment :: Web Environment",
        "License :: OSI Approved :: MIT License",
        "Intended Audience :: Developers",
        "Operating System :: OS Independent",
    ],
)
