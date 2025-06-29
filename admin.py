import streamlit as st
import json
import os
from datetime import datetime
from utils import get_all_users, get_user_stats, load_chat_history, is_admin

def show_admin_page():
    """Display the admin panel"""
    
    # Check if user is admin
    if not is_admin():
        st.error("Access denied. Admin privileges required.")
        return
    
    st.title("⚙️ Admin Panel")
    st.markdown("---")
    
    # Create tabs for different admin functions
    tab1, tab2, tab3, tab4 = st.tabs(["📊 Dashboard", "👥 User Management", "💬 Chat Logs", "🔧 Settings"])
    
    with tab1:
        show_admin_dashboard()
    
    with tab2:
        show_user_management()
    
    with tab3:
        show_chat_logs()
    
    with tab4:
        show_admin_settings()

def show_admin_dashboard():
    """Show admin dashboard with statistics"""
    st.header("Dashboard Overview")
    
    # Get user statistics
    stats = get_user_stats()
    
    # Display stats in columns
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Total Users", stats['total_users'])
    
    with col2:
        st.metric("Admin Users", stats['admin_users'])
    
    with col3:
        st.metric("Regular Users", stats['regular_users'])
    
    st.markdown("---")
    
    # System information
    st.subheader("System Information")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.info(f"**Current Time:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        st.info(f"**Server Status:** 🟢 Online")
    
    with col2:
        # Check if data directory exists
        data_dir_exists = os.path.exists('data')
        st.info(f"**Data Directory:** {'✅ Exists' if data_dir_exists else '❌ Missing'}")
        
        # Count chat history files
        if data_dir_exists:
            chat_files = len([f for f in os.listdir('data') if f.endswith('_chat_history.json')])
            st.info(f"**Chat History Files:** {chat_files}")

def show_user_management():
    """Show user management interface"""
    st.header("User Management")
    
    users = get_all_users()
    
    if users:
        st.subheader("Current Users")
        
        # Display users in a table format
        user_data = []
        for username in users:
            from utils import DEMO_USERS
            user_info = DEMO_USERS[username]
            user_data.append({
                "Username": username,
                "Role": user_info['role'],
                "Email": user_info['email'],
                "Created": user_info['created_at']
            })
        
        st.dataframe(user_data, use_container_width=True)
        
        st.markdown("---")
        
        # User actions
        st.subheader("User Actions")
        
        selected_user = st.selectbox("Select User", users)
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            if st.button("View Chat History"):
                st.session_state.selected_user_for_logs = selected_user
                st.success(f"Selected {selected_user} for chat log viewing")
        
        with col2:
            if st.button("Reset Password"):
                st.warning("Password reset functionality would be implemented here")
        
        with col3:
            if st.button("Delete User"):
                st.error("User deletion functionality would be implemented here")
    
    else:
        st.warning("No users found")

def show_chat_logs():
    """Show chat logs for all users"""
    st.header("Chat Logs")
    
    users = get_all_users()
    
    # User selection
    selected_user = st.selectbox(
        "Select User to View Chat History", 
        users, 
        index=users.index(st.session_state.get('selected_user_for_logs', users[0])) if st.session_state.get('selected_user_for_logs') in users else 0
    )
    
    if selected_user:
        st.subheader(f"Chat History for {selected_user}")
        
        # Load and display chat history
        chat_history = load_chat_history(selected_user)
        
        if chat_history:
            st.info(f"Total conversations: {len(chat_history)}")
            
            # Display chat history in reverse chronological order
            for i, chat in enumerate(reversed(chat_history)):
                with st.expander(f"Conversation {len(chat_history) - i} - {chat.get('timestamp', 'Unknown time')}"):
                    st.markdown(f"**User:** {chat.get('message', 'No message')}")
                    st.markdown(f"**Bot:** {chat.get('response', 'No response')}")
        else:
            st.info(f"No chat history found for {selected_user}")
        
        # Export functionality
        if chat_history:
            st.markdown("---")
            if st.button("Export Chat History"):
                # Convert to JSON string for download
                json_string = json.dumps(chat_history, indent=2)
                st.download_button(
                    label="Download as JSON",
                    data=json_string,
                    file_name=f"{selected_user}_chat_history.json",
                    mime="application/json"
                )

def show_admin_settings():
    """Show admin settings"""
    st.header("System Settings")
    
    # Chatbot settings
    st.subheader("Chatbot Configuration")
    
    with st.form("chatbot_settings"):
        max_response_length = st.number_input("Max Response Length", value=1000, min_value=100, max_value=5000)
        enable_logging = st.checkbox("Enable Chat Logging", value=True)
        debug_mode = st.checkbox("Debug Mode", value=False)
        
        if st.form_submit_button("Save Settings"):
            # In a real app, these would be saved to a config file or database
            st.success("Settings saved successfully!")
            st.info("Note: In this demo, settings are not persisted")
    
    st.markdown("---")
    
    # Data management
    st.subheader("Data Management")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("Backup Data"):
            st.success("Data backup initiated")
            st.info("Backup functionality would be implemented here")
    
    with col2:
        if st.button("Clear All Logs", type="secondary"):
            if st.checkbox("I understand this will delete all chat logs"):
                st.error("Log clearing functionality would be implemented here")
    
    st.markdown("---")
    
    # System maintenance
    st.subheader("System Maintenance")
    
    if st.button("View System Logs"):
        st.code("""
2025-06-28 10:00:00 - INFO - System started
2025-06-28 10:05:00 - INFO - User 'admin' logged in
2025-06-28 10:10:00 - INFO - Chat session started
2025-06-28 10:15:00 - INFO - Message processed
        """)
    
    if st.button("System Health Check"):
        st.success("✅ All systems operational")
        st.info("📊 Memory usage: Normal")
        st.info("🔗 Database connection: Active")
        st.info("🤖 AI Model: Ready")
