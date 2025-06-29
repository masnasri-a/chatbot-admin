from supabase import create_client, Client

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()


# Supabase configuration
def get_supabase_client() -> Client:
    """Create and return a Supabase client."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        raise ValueError("Supabase URL and Key must be set in environment variables.")
    
    return create_client(url, key)