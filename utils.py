import streamlit as st
import hashlib
import json
import os

# Demo user database (in a real app, this would be a proper database)
DEMO_USERS = {
    "admin": {
        "password_hash": "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",  # admin123
        "role": "admin",
        "email": "admin@example.com",
        "created_at": "2025-01-01"
    },
    "user": {
        "password_hash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",  # user123
        "role": "user",
        "email": "user@example.com",
        "created_at": "2025-01-01"
    }
}

def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def authenticate_user(username, password):
    """Authenticate user credentials"""
    if username in DEMO_USERS:
        user_data = DEMO_USERS[username]
        password_hash = hash_password(password)
        
        if password_hash == user_data["password_hash"]:
            return user_data
    return None

def get_user_data(username):
    """Get user data by username"""
    return DEMO_USERS.get(username, None)

def check_authentication():
    """Check if user is authenticated"""
    return st.session_state.get('authenticated', False)

def logout_user():
    """Log out the current user"""
    st.session_state.authenticated = False
    st.session_state.username = None
    st.session_state.user_role = None
    st.session_state.page = 'login'
    
    # Clear any cached data
    if 'chat_history' in st.session_state:
        del st.session_state.chat_history

def is_admin():
    """Check if current user is admin"""
    return st.session_state.get('user_role') == 'admin'

def get_chat_history_file(username):
    """Get the chat history file path for a user"""
    os.makedirs('data', exist_ok=True)
    return f"data/{username}_chat_history.json"

def save_chat_message(username, message, response):
    """Save a chat message to user's history"""
    history_file = get_chat_history_file(username)
    
    # Load existing history
    chat_history = []
    if os.path.exists(history_file):
        try:
            with open(history_file, 'r') as f:
                chat_history = json.load(f)
        except:
            chat_history = []
    
    # Add new message
    chat_entry = {
        "timestamp": st.session_state.get('current_time', ''),
        "message": message,
        "response": response
    }
    chat_history.append(chat_entry)
    
    # Save updated history
    try:
        with open(history_file, 'w') as f:
            json.dump(chat_history, f, indent=2)
    except Exception as e:
        st.error(f"Error saving chat history: {e}")

def load_chat_history(username):
    """Load chat history for a user"""
    history_file = get_chat_history_file(username)
    
    if os.path.exists(history_file):
        try:
            with open(history_file, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def get_all_users():
    """Get all users (admin function)"""
    return list(DEMO_USERS.keys())

def get_user_stats():
    """Get user statistics (admin function)"""
    stats = {
        "total_users": len(DEMO_USERS),
        "admin_users": len([u for u in DEMO_USERS.values() if u['role'] == 'admin']),
        "regular_users": len([u for u in DEMO_USERS.values() if u['role'] == 'user'])
    }
    return stats
