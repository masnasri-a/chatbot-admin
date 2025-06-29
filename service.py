from turtle import st
from config import get_supabase_client


def get_list_workspaces():
    """Fetch the list of workspaces from Supabase"""
    supabase = get_supabase_client()
    
    # Query the workspaces table
    response = supabase.table('workspaces').select('*').execute()
    
    if response.error:
        raise Exception(f"Error fetching workspaces: {response.error.message}")
    
    return response.data

def create_workspace_svc(name, slug, expired_at, tier, platform, active):
    """Create a new workspace in Supabase"""
    print(f"Creating workspace: {name}, slug: {slug}, expired_at: {expired_at}, tier: {tier}")
    supabase = get_supabase_client()

    # Insert the new workspace into the workspace table
    response = supabase.table('workspace').insert({
        'workspace_name': name,
        'slug': slug,
        'expired_at': expired_at,
        'owner_id': 4,
        'tier': tier,
        'platform': platform,
        'active': active
    }).execute()
    print(response)
    