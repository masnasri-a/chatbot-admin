import streamlit as st
from login import show_login_page
from admin import show_admin_page
from menu.chatbot import show_chatbot_page
from menu.faq_content import faq_content_page
from utils import check_authentication, logout_user

def main():
    """Main application entry point with routing logic"""
    
    # Configure page
    st.set_page_config(
        page_title="AI Chatbot",
        page_icon="🤖",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Initialize session state
    if 'authenticated' not in st.session_state:
        st.session_state.authenticated = False
    if 'username' not in st.session_state:
        st.session_state.username = None
    if 'user_role' not in st.session_state:
        st.session_state.user_role = None
    if 'page' not in st.session_state:
        st.session_state.page = 'login'
    
    # Check authentication status
    if not st.session_state.authenticated:
        show_login_page()
    else:
        # Sidebar navigation for authenticated users
        with st.sidebar:
            st.write(f"Welcome, {st.session_state.username}!")
            st.write(f"Role: {st.session_state.user_role}")
            
            st.markdown("---")
            
            # Navigation menu
            if st.button("💬 Chatbot Panel", use_container_width=True):
                st.session_state.page = 'chatbot'
                st.rerun()
            
            if st.session_state.user_role == 'admin':
                if st.button("⚙️ Admin Panel", use_container_width=True):
                    st.session_state.page = 'admin'
                    st.rerun()
            if st.button("❓ FAQ", use_container_width=True):
                st.session_state.page = 'faq'
                st.rerun()
            
            st.markdown("---")
            
            if st.button("🚪 Logout", use_container_width=True):
                logout_user()
                st.rerun()
        
        # Route to appropriate page
        if st.session_state.page == 'chatbot':
            show_chatbot_page()
        elif st.session_state.page == 'admin' and st.session_state.user_role == 'admin':
            show_admin_page()
        elif st.session_state.page == 'faq':
            faq_content_page()
        else:
            # Default to chatbot for regular users
            st.session_state.page = 'chatbot'
            show_chatbot_page()

if __name__ == "__main__":
    main()
