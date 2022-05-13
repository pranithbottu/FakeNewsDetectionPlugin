================
Fake News Grader
================

    A backend server hosting the classifier model to grade news.

Installation
============

Within your Python environment (e.g. ``conda``, ``virtualenv``), install the dependencies.
::
  pip install -r requirements.txt


Build and install this package
::
  pip install -e .


Deployment
==========

To deploy the server, execute the installed executable.
::
  news_grader

Test liveliness by pinging the server.
::
  curl -X GET http://127.0.0.1:5000/api/v1/meta/ping

Test text grader by posting to `grade/text` endpoint
::
  curl -X POST http://127.0.0.1:5000/api/v1/grade/text -H 'Content-Type: application/json' -d '{"text": "A fake sentence. This one is real though."}'


Testing
=======

After installing `news_grader` under Installation instruction, we can run the unit tests.
::
  pytest

