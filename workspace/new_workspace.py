import streamlit as st
from enum import Enum
from datetime import datetime, timedelta
from service import create_workspace_svc
from config import get_supabase_client

class Tier(Enum):
    FREE = "free"
    PAID = "paid"

class Platform(Enum):
    WEB = "web"
    WHATSAPP = "whatsapp"
    ALL = "all"

@st.dialog("Create a new workspace")
def create_workspace(item):
    """Function to create a new workspace"""
    st.write(f"You are creating a new workspace: {item}")
    name = st.text_input("Workspace Name", placeholder="Enter workspace name")
    slug = st.text_input("Workspace Slug", placeholder="Enter workspace slug")
    platform = st.selectbox("Platform", options=[platform.value for platform in Platform], help="Select the platform for the workspace")
    tier = st.selectbox("Tier", options=[tier.value for tier in Tier], help="Select the workspace tier")
    if tier == Tier.FREE.value:
        expired_at = st.date_input("Expiration Date", value=datetime.today() + timedelta(weeks=2), help="Select the expiration date for the workspace", disabled=True)
    else:
        expired_at = st.date_input("Expiration Date", value=None, help="Select the expiration date for the workspace")
    if st.button("Submit"):
        # Validate form inputs
        if not name:
            st.error("Please enter a workspace name")
            return
        if not slug:
            st.error("Please enter a workspace slug")
            return
        
        # Convert date to string for JSON serialization
        expired_at_str = None
        if expired_at is not None:
            expired_at_str = expired_at.strftime('%Y-%m-%d')
        
        st.session_state.create_workspace = {
            'workspace_name': name,
            'slug': slug,
            'expired_at': expired_at_str,
            'owner_id': 4,
            'tier': tier,
            'platform': platform,
            'active': False
        }
        create_workspace_svc(
            name=name,
            slug=slug,
            expired_at=expired_at_str,
            tier=tier,
            platform=platform,
            active=False
        )

        st.rerun()
