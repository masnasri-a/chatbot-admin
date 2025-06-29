import streamlit as st
from config import get_supabase_client
def faq_content_page():
    """Display the FAQ interface"""

    st.title("❓ FAQ")
    st.markdown("Frequently Asked Questions")
    supabase = get_supabase_client()
    # Fetch the list of workspaces from Supabase
    response = supabase.table('workspace').select('id', 'workspace_name').execute()
    print(response)
    list_workspaces = response.data
    if not list_workspaces:
        st.warning("No workspaces available. Please create a workspace first.")
        return
    st.subheader("Select a Workspace")
    workspace_id = st.selectbox("Choose a workspace", options=[workspace['id'] for workspace in list_workspaces], format_func=lambda x: next((item['workspace_name'] for item in list_workspaces if item['id'] == x), "Unknown Workspace"))
    if workspace_id:
        st.session_state.selected_workspace_id = workspace_id
        # Fetch FAQ content for the selected workspace
        faq_response = supabase.table('faq_content').select('*').eq('workspace_id', workspace_id).execute()
        print(faq_response)
        if not faq_response.data:
            st.info("No FAQ content found for this workspace.")
            if st.button("Add New FAQ"):
                st.session_state.show_add_faq = True
            if st.session_state.get('show_add_faq', False):
                with st.form("add_faq_form"):
                    st.subheader("Add New FAQ")
                    docs_url_link = st.text_input("Url Google Docs", placeholder="Enter Google Docs URL")
                    if st.form_submit_button("Submit"):
                        print(f"Adding FAQ content for workspace {workspace_id} with URL: {docs_url_link}")
                        supabase.table('faq_content').insert({
                            'workspace_id': workspace_id,
                            'url_google_docs': docs_url_link
                        }).execute()
                        st.success("FAQ content added successfully!")
                        st.session_state.show_add_faq = False
                        st.rerun()
        else:
            st.subheader("FAQ Content")
            for faq in faq_response.data:
                st.markdown(f"**URL:** {faq['url_google_docs']}")
                if st.button("Edit", key=f"edit_{faq['id']}"):
                    st.session_state.edit_faq = faq
                    st.session_state.show_edit_faq = True

            if st.session_state.get('show_edit_faq', False):
                with st.form("edit_faq_form"):
                    st.subheader("Edit FAQ")
                    faq_to_edit = st.session_state.edit_faq
                    docs_url_link = st.text_input("Url Google Docs", value=faq_to_edit['url_google_docs'], placeholder="Enter Google Docs URL")

                    if st.form_submit_button("Update", type="primary"):
                        supabase.table('faq_content').update({
                            'url_google_docs': docs_url_link
                        }).eq('id', faq_to_edit['id']).execute()
                        st.success("FAQ content updated successfully!")
                        st.session_state.show_edit_faq = False
                        del st.session_state.edit_faq
                        st.rerun()
