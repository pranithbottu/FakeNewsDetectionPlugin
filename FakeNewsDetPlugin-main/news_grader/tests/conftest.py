import pytest
import os

from news_grader.app import create_app


# def pytest_addoption(parser):
#   # ability to test API on different hosts
#   parser.addoption("--host", action="store", default="http://127.0.0.1:5000")

@pytest.fixture(scope="session")
def host(request):
    # return request.config.getoption("--host")
    return "http://127.0.0.1:5000"


@pytest.fixture(scope="session")
def api_v1_host(host):
    return os.path.join(host, "api", "v1")


@pytest.fixture(scope="session")
def api_v1_meta(api_v1_host):
    return os.path.join(api_v1_host, "meta")


@pytest.fixture(scope="session")
def api_v1_meta_ping(api_v1_meta):
    return os.path.join(api_v1_meta, "ping")


@pytest.fixture(scope="session")
def api_v1_grade(api_v1_host):
    return os.path.join(api_v1_host, "grade")


@pytest.fixture(scope="session")
def api_v1_grade_text(api_v1_grade):
    return os.path.join(api_v1_grade, "text")


@pytest.fixture
def app():
    # more setup here?
    news_grader_app = create_app("")
    return news_grader_app


@pytest.fixture
def client(app):
    return app.test_client()

# @pytest.fixture
# def server(app):
#     from multiprocessing import Process
#     server_proc = Process(target=app.run)
#     yield server_proc.start()

#     # terminate thread
#     server_proc.terminate()
#     server_proc.join()
