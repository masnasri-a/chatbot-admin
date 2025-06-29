import streamlit as st
import hashlib
from utils import authenticate_user, get_user_data

def show_login_page():
    """Display the login page"""
    
    st.markdown("""
    <div style="text-align: center;">
        <h1>🤖 AI Chatbot</h1>
        <h3>Please log in to continue</h3>
    </div>
    """, unsafe_allow_html=True)
    
    # Create two columns for better layout
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        # Login form
        with st.form("login_form"):
            st.markdown("### Login")
            
            username = st.text_input("Username", placeholder="Enter your username")
            password = st.text_input("Password", type="password", placeholder="Enter your password")
            
            login_button = st.form_submit_button("Login", use_container_width=True)
            
            if login_button:
                if username and password:
                    # Authenticate user
                    user_data = authenticate_user(username, password)
                    if user_data:
                        # Set session state
                        st.session_state.authenticated = True
                        st.session_state.username = username
                        st.session_state.user_role = user_data['role']
                        st.session_state.page = 'chatbot'
                        
                        st.success(f"Welcome back, {username}!")
                        st.rerun()
                    else:
                        st.error("Invalid username or password")
                else:
                    st.warning("Please enter both username and password")
        
        # Demo credentials info
        st.markdown("---")
        st.info("""
        **Demo Credentials:**
        
        **Admin User:**
        - Username: admin
        - Password: admin123
        
        **Regular User:**
        - Username: user
        - Password: user123
        """)
        
        # Registration section (simplified for demo)
        with st.expander("Don't have an account? Register here"):
            with st.form("register_form"):
                st.markdown("### Register New Account")
                
                new_username = st.text_input("Choose Username", placeholder="Enter desired username")
                new_password = st.text_input("Choose Password", type="password", placeholder="Enter password")
                confirm_password = st.text_input("Confirm Password", type="password", placeholder="Confirm your password")
                
                register_button = st.form_submit_button("Register", use_container_width=True)
                
                if register_button:
                    if new_username and new_password and confirm_password:
                        if new_password == confirm_password:
                            # For demo purposes, we'll just show a message
                            # In a real app, you'd save to a database
                            st.success("Registration successful! You can now log in with your credentials.")
                            st.info("Note: In this demo, registration is simulated. Use the demo credentials above to log in.")
                        else:
                            st.error("Passwords do not match")
                    else:
                        st.warning("Please fill in all fields")

def hash_password(password):
    """Hash password for storage"""
    return hashlib.sha256(password.encode()).hexdigest()
