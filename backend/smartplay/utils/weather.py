import requests
from datetime import datetime, timedelta
from django.conf import settings

def get_weather_data(location):
    api_key = settings.OPENWEATHER_API_KEY
    base_url = "http://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": location,   # The location (city name)
        "appid": api_key,  # Your API Key
        "units": "metric",  # For Celsius temperature
    }
    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        return None


def get_future_weather_data(location):
    current_weather = get_weather_data(location)
    if not current_weather:
        return None
    
    lat = current_weather.get('coord', {}).get('lat')
    lon = current_weather.get('coord', {}).get('lon')
    
    if lat and lon:
        api_key = settings.OPENWEATHER_API_KEY
        base_url = "https://api.openweathermap.org/data/2.5/forecast"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": api_key,
            "units": "metric",
            "cnt": 16  # 16 data points (3-hour intervals) ~ 48 hours
        }
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            return response.json().get('list', [])  # Extract only the forecast list
    
    return None