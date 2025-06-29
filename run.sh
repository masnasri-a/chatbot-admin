#!/bin/bash

# Streamlit Chatbot Launch Script
echo "🚀 Starting Streamlit Chatbot Application..."
echo "📁 Project: streamlit-chatbot"
echo "🔧 Activating virtual environment..."

# Navigate to project directory
cd "$(dirname "$0")"

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies if needed
echo "📦 Checking dependencies..."
pip install -r requirements.txt --quiet

# Launch Streamlit app
echo "🤖 Launching chatbot application..."
echo "🌐 Application will open at: http://localhost:8501"
echo ""
echo "Demo Credentials:"
echo "Admin: admin / admin123"
echo "User:  user / user123"
echo ""
echo "Press Ctrl+C to stop the application"
echo "=================="

streamlit run main.py
