# import os
# import requests


# def test_wsgi_via_requests(api_v1_host):
#     # startup from usgi
#     from news_grader.wsgi import run as run_news_grader
#     from multiprocessing import Process
#     server_proc = Process(target=run_news_grader)

#     try:
#         # start server
#         server_proc.start()

#         # test ping
#         endpoint = os.path.join(api_v1_host, 'meta', 'ping')
#         response = requests.get(endpoint)
#         assert response.status_code == 200, f"{response} at {endpoint}"
#         json = response.json()
#         assert 'msg' in json
#         assert json['msg'] == "pong"
#     finally:
#         # shutdown
#         server_proc.terminate()
#         server_proc.join()


def test_meta_ping_via_client(client, api_v1_meta_ping):
    response = client.get(api_v1_meta_ping)
    assert response.status_code == 200, f"{response} at {api_v1_meta_ping}"
    json = response.json
    assert 'msg' in json
    assert json['msg'] == "pong"


def test_grade_text_via_client_bad(client, api_v1_grade_text):
    response = client.post(api_v1_grade_text)
    assert response.status_code == 400, f"{response} at {api_v1_grade_text}"


def test_grade_text_via_client_missing_field(client, api_v1_grade_text):
    response = client.post(api_v1_grade_text, json=dict())
    assert response.status_code == 400, f"{response} at {api_v1_grade_text}"
    json = response.json
    assert json is not None
    assert 'exception_type' in json and json['exception_type'] == "ValueError"
    assert 'message' in json and json['message'] == "Missing 'text' field"


def test_grade_text_via_client_success(client, api_v1_grade_text):
    response = client.post(api_v1_grade_text, json={'text': 'Tis but fake news'})
    assert response.status_code == 200, \
        f"{response}, {response.json} at {api_v1_grade_text}"
    json = response.json
    assert json is not None
    assert 'segment_with_scores' in json
    for segment in json['segment_with_scores']:
        assert isinstance(segment["text"], str)
        assert 0.0 <= segment["false_score"] <= 1.0
        assert 0.0 <= segment["partial_false_score"] <= 1.0
        assert 0.0 <= segment["truth_score"] <= 1.0
