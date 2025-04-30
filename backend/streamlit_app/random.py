import pandas as pd
import joblib
from collections import Counter

# Load the trained model
model_path = r"E:\smartplay\backend\holder\mlmodel\healthrefined2.pkl"
model = joblib.load(model_path)

# Sample manual input (you can change these values)
manual_input = {
    "steps": 10000,
    "distance_moved": 4.2,  # in kilometers
    "calories_burned": 1500,
    "heart_rate": 85,
    "activity_sessions": 100
}

# Prepare data in DataFrame format
input_df = pd.DataFrame([{
    'TotalSteps': manual_input["steps"],
    'TotalDistance': manual_input["distance_moved"],
    'Calories': manual_input["calories_burned"],
    'AvgHeartRate': manual_input["heart_rate"],
    'TotalActiveMinutes': manual_input["activity_sessions"]
}])

# Ensure data types are correct
input_df = input_df.astype({
    'TotalSteps': 'int',
    'TotalDistance': 'float',
    'Calories': 'int',
    'AvgHeartRate': 'float',
    'TotalActiveMinutes': 'int'
})

# Fill missing values just in case
input_df.fillna({
    'TotalSteps': 0,
    'TotalDistance': 0.0,
    'Calories': 0,
    'AvgHeartRate': 70,
    'TotalActiveMinutes': 0
}, inplace=True)

# Run prediction
prediction = model.predict(input_df)
print("Prediction:", prediction[0])
