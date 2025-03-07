import requests

API_KEY = "openuv-43570rm7lngfzn-io"
LAT = 11.25
LON = 75.7667

url = f"https://api.openuv.io/api/v1/uv?lat={LAT}&lng={LON}"
headers = {"x-access-token": API_KEY}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("Success! UV Data:", response.json())
else:
    print("Error:", response.status_code, response.json())
