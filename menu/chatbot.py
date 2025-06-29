import streamlit as st
import random
import time
from datetime import datetime, timedelta

import supabase
from utils import save_chat_message
from workspace.new_workspace import create_workspace
from config import get_supabase_client

def show_chatbot_page():
    """Display the main chatbot interface"""
    
    st.title("🤖 Client Workspace")
    st.markdown("client workspace for adding new workspaces")
    if st.button("Add New Workspace"):
        create_workspace("create")
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Workspace List")
        supabase = get_supabase_client()
        response = supabase.table('workspace').select('*, users(*)').execute()
        col_name, col_owner, col_created, col_actions = st.columns([3, 2, 2, 3])
        with col_name:
            st.write("**Workspace Name**")
        with col_owner:
            st.write("**Owner**")
        with col_created:
            st.write("**Created At**")
        with col_actions:
            st.write("**Actions**")

        for i, item in enumerate(response.data):
            col_name, col_owner, col_created, col_actions = st.columns([3, 2, 2, 3])
            with col_name:
                st.write(item['workspace_name'])
            with col_owner:
                st.write(item['users']['full_name'])
            with col_created:
                st.write(item['created_at'])
            with col_actions:
                if st.button("✏️", key=f"edit_{i}"):
                    st.write(f"Editing workspace: {item['workspace_name']}")
                    st.session_state.edit_workspace = item

    with col2:
        st.subheader("Update Workspace")
        if 'edit_workspace' in st.session_state:
            workspace = st.session_state.edit_workspace
            
            with st.form("update_workspace_form"):
                updated_name = st.text_input("Workspace Name", value=workspace['workspace_name'])
                updated_slug = st.text_input("Slug", value=workspace.get('slug', ''))
                updated_tier = st.selectbox("Tier", options=["free", "paid"], index=0 if workspace.get('tier') == 'free' else 1)
                updated_platform = st.selectbox("Platform", options=["web", "whatsapp", "all"], index=0 if workspace.get('platform') == 'web' else 1 if workspace.get('platform') == 'whatsapp' else 2)
                updated_active = st.checkbox("Active", value=workspace.get('active', False))
                update_expired_at = st.date_input("Expiration Date", value=datetime.strptime(workspace.get('expired_at', datetime.today().strftime('%Y-%m-%d')), '%Y-%m-%d') if workspace.get('expired_at') else datetime.today() + timedelta(weeks=2), disabled=updated_tier == 'free')
                
                if st.form_submit_button("Update Workspace"):
                    supabase = get_supabase_client()
                    update_data = {
                        'workspace_name': updated_name,
                        'slug': updated_slug,
                        'tier': updated_tier,
                        'platform': updated_platform,
                        'active': updated_active,
                        'expired_at': update_expired_at.strftime('%Y-%m-%d') if update_expired_at else None
                    }
                    response = supabase.table('workspace').update(update_data).eq('id', workspace['id']).execute()
                    if response.data:
                        st.success("Workspace updated successfully!")
                        del st.session_state.edit_workspace
                        st.rerun()
                    else:
                        st.error("Failed to update workspace")
                if st.form_submit_button("Delete Workspace", type="primary"):
                    @st.dialog("Confirm Deletion")
                    def confirm_delete():
                        st.write(f"Are you sure you want to delete the workspace '{workspace['workspace_name']}'?")
                        st.write("This action cannot be undone.")
                        
                        col1, col2 = st.columns(2)
                        with col1:
                            if st.button("Yes, Delete", type="primary"):
                                supabase.table('workspace').delete().eq('id', workspace['id']).execute()
                                st.success("Workspace deleted successfully!")
                                del st.session_state.edit_workspace
                                st.rerun()
                                return True
                        with col2:
                            if st.button("Cancel"):
                                return False
                        return None
                        
            
        else:
            st.info("Select a workspace from the list to edit")
