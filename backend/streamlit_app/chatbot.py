import streamlit as st
from fuzzywuzzy import process  # For fuzzy matching
import spacy  # For keyword extraction
import time  # For simulating typing effect

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

# Custom CSS to remove deploy button, menu, and footer
custom_css = """
    <style>
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        header {visibility: hidden;}
    </style>
"""
st.markdown(custom_css, unsafe_allow_html=True)

# ✅ UI Components (Always on top)
st.markdown("<h3 style='text-align: center;'>PlayMate AI 🤖</h3>", unsafe_allow_html=True)
st.markdown("<p style='text-align: center; font-size: 16px;'>Ask me about the website or gaming tips!</p>", unsafe_allow_html=True)

# Predefined responses
responses = {
    "hi": "Welcome to Smart Playground! How can I help you?",
    "what's up": "I'm alright What about you? ",
    "okay": "Great, if you have a query, feel free to ask🚀",
    "help": "This platform allows you to book playgrounds, check weather-based recommendations, get health advice, and receive personalized fitness and diet suggestions.🚀",
    "how to book": "Visit the 'Playground' section, search by location, check availability, and complete the booking process. You'll get a digital ticket and weather-based play suggestions.",
    "cricket tips": "To improve your cricket skills, maintain a balanced stance, practice different bowling techniques, and focus on fielding and reflexes.",
    "football tips": "Work on dribbling, passing accuracy, and overall fitness. Smart Playground helps you find optimal weather conditions for safe play.",
    "physical activity tips": "Warm up before workouts, stay hydrated, and track fitness data using our Google Fit integration for personalized health advice.",
    "skin protection tips": "Our platform alerts you when the UV index is too high. Use sunscreen, wear protective clothing, and avoid direct sunlight during peak hours.",
    "health and diet tips": "Based on your activity, we provide diet suggestions. Ensure proper hydration, balance protein intake, and adjust nutrition for better performance.",
    "faq help": "Ask any question in the FAQ section. If similar queries exist, you'll get an instant answer. Otherwise, you can submit new queries for support.",
}

# Function to match user input using fuzzy logic and NLP
def chatbot_response(user_input):
    user_input = user_input.lower().strip()
    
    # Extract keywords using spaCy
    doc = nlp(user_input)
    keywords = [token.text for token in doc if token.is_alpha]

    # Try fuzzy matching
    best_match, score = process.extractOne(user_input, responses.keys())
    if score > 60:
        return responses[best_match]

    # Match based on extracted keywords
    for word in keywords:
        for key in responses.keys():
            if word in key:
                return responses[key]
    
    return "Sorry, I don't have an answer for that."

# Initialize session state for chat history
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# Function to handle sending messages with typing effect
def send_message():
    user_input = st.session_state.user_input.strip()

    if user_input:
        bot_response = chatbot_response(user_input)

        # Append user message to chat history
        st.session_state.chat_history.append(f"**You:** {user_input}")

        # Typing effect simulation
        bot_text = ""
        for char in bot_response:
            bot_text += char
            time.sleep(0.02)  # Adjust speed if needed

        # Store the final bot response in history
        st.session_state.chat_history.append(f"**🤖:** {bot_text}")

        # Clear input field
        st.session_state.user_input = ""

# ✅ Display chat history inside a container (Keeps UI on top)
chat_container = st.container()
with chat_container:
    for chat in st.session_state.chat_history:
        st.write(chat)

# User input at the bottom
st.text_input("You:", key="user_input", on_change=send_message)
