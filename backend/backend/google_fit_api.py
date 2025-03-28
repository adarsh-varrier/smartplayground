import os
import time
import psutil
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.location.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',  # ❤️ Heart Rate
    'https://www.googleapis.com/auth/fitness.sleep.read'         # 💤 Sleep Data 
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
CLIENT_SECRET_FILE = os.path.join(BASE_DIR, 'clientSecret/client_secret.json')
REDIRECT_PORT = 9090  # Google OAuth fixed port

def free_port(port):
    """ Kill any process using the given port """
    for proc in psutil.process_iter(attrs=['pid', 'name']):
        try:
            connections = proc.net_connections(kind='inet')  # Fixed deprecated method
            for conn in connections:
                if conn.laddr.port == port:
                    proc.terminate()  # Kill process
                    proc.wait(timeout=2)  # Ensure process is closed
                    print(f"Freed port {port} from process {proc.pid}")
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass  # Ignore if the process is already closed

def authenticate_google_fit(user_id):
    """ Authenticate each user individually using their own credentials. """
    creds = None

    FIT_TOKEN_DIR = os.path.join(BASE_DIR, "fitToken")  # Directory to store tokens

    # Ensure the directory exists
    os.makedirs(FIT_TOKEN_DIR, exist_ok=True)

    # Path for storing the user-specific token file
    user_token_file = os.path.join(FIT_TOKEN_DIR, f"{user_id}_google_fit_token.json")

    # Load user-specific credentials if available
    if os.path.exists(user_token_file):
        creds = Credentials.from_authorized_user_file(user_token_file, SCOPES)

    if creds:
        print(f"User {user_id} Token Expiry:", creds.expiry)
        print(f"Is Token Expired?: {creds.expired}")

    # Refresh expired token or authenticate user
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())  # Refresh token
        else:
            free_port(REDIRECT_PORT)  # Free port before authentication
            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRET_FILE, SCOPES
            )
            creds = flow.run_local_server(
                port=REDIRECT_PORT, access_type='offline', prompt='consent'
            )

            # Save user-specific credentials
            with open(user_token_file, 'w') as token:
                token.write(creds.to_json())

    return creds


def fetch_google_fit_data(user_id,data_source_id):
    """ Generic function to fetch Google Fit data """
    creds = authenticate_google_fit(user_id)  # Authenticate the user
    service = build('fitness', 'v1', credentials=creds)

    now = time.time_ns()
    start_time = now - (24 * 60 * 60 * 1_000_000_000)  # 24 hours ago
    end_time = now
    dataset = f"{start_time}-{end_time}"

    try:
        response = service.users().dataSources().datasets().get(
            userId='me', dataSourceId=data_source_id, datasetId=dataset
        ).execute()

        # Sum all numeric values (int or float) from the dataset
        total_sum = sum(
            value.get("fpVal", value.get("intVal", 0))
            for point in response.get("point", [])
            for value in point.get("value", [])
        )

        return total_sum  # Return the computed sum

    except Exception as e:
        return f"Error fetching data: {str(e)}"  # Return error message


# Fetching Different Health Data (Including all available categories)
data_sources = {
    "Steps": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
    "Calories Burned": "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended",
    "Active Minutes": "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes",
    "Body Measurements": "derived:com.google.body.fat.percentage:com.google.android.gms:merged",
    "Heart Rate": "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm",
    "Distance Moved": "derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta",
    "Move Minutes": "derived:com.google.move_minutes:com.google.android.gms:merge_move_minutes",
    "Weight": "derived:com.google.weight:com.google.android.gms:merge_weight",
    "Height": "derived:com.google.height:com.google.android.gms:merge_height",
    "Sleep Data": "derived:com.google.sleep.segment:com.google.android.gms:merge_sleep",
    "Activity Sessions": "derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments",
}

def fetch_all_google_fit_data(user_id):
    """ Fetch all health data categories for a user """
    return {key: fetch_google_fit_data(user_id, source_id) for key, source_id in data_sources.items()}

def google_fit_sign_out(user_id):
    """ Sign out user by deleting their stored Google Fit token """
    FIT_TOKEN_DIR = os.path.join(BASE_DIR, "fitToken")  
    user_token_file = os.path.join(FIT_TOKEN_DIR, f"{user_id}_google_fit_token.json")

    if os.path.exists(user_token_file):
        os.remove(user_token_file)  # Delete the token file
        return {"status": "success", "message": "User signed out from Google Fit"}
    
    return {"status": "error", "message": "User is already signed out"}
