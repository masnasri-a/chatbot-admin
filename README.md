# Streamlit Chatbot with Login and Admin Panel

A feature-rich Streamlit chatbot application with user authentication and administrative capabilities.

## Features

### 🔐 Authentication System
- User login with username/password
- Role-based access control (Admin/User)
- Session management
- Secure logout functionality

### 🤖 Chatbot Interface
- Interactive chat interface
- Message history within sessions
- Auto-save conversations to user history
- Chat statistics and controls
- Responsive design

### ⚙️ Admin Panel (Admin Users Only)
- Dashboard with user statistics
- User management interface
- Chat log viewing for all users
- System settings configuration
- Data management tools
- System health monitoring

## Quick Start

### 1. Setup Environment
```bash
# Navigate to project directory
cd streamlit-chatbot

# Activate virtual environment (if you have one)
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Run the Application
```bash
streamlit run main.py
```

### 3. Access the Application
Open your browser and go to `http://localhost:8501`

## Demo Credentials

### Admin User
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Full admin panel + chatbot

### Regular User
- **Username:** `user`
- **Password:** `user123`
- **Access:** Chatbot only

## File Structure

```
streamlit-chatbot/
├── main.py           # Main application with routing
├── login.py          # Login page functionality
├── admin.py          # Admin panel interface
├── chatbot.py        # Main chatbot interface
├── utils.py          # Utility functions for auth and data
├── requirements.txt  # Python dependencies
├── README.md         # This file
├── data/            # User chat history (created automatically)
└── venv/            # Virtual environment
```

## Usage Guide

### For Regular Users
1. Log in with user credentials
2. Start chatting with the AI bot
3. Use sidebar controls to clear chat or save conversations
4. View session statistics
5. Logout when done

### For Admin Users
1. Log in with admin credentials
2. Access the admin panel from the sidebar
3. **Dashboard Tab:** View system statistics and status
4. **User Management Tab:** View all users and perform user actions
5. **Chat Logs Tab:** View and export chat histories for any user
6. **Settings Tab:** Configure system settings and perform maintenance

## Features in Detail

### Authentication System
- Passwords are hashed using SHA-256
- Session state management prevents unauthorized access
- Role-based routing ensures proper access control

### Chatbot Capabilities
- Context-aware responses
- Multiple response types (greetings, jokes, help, etc.)
- Conversation persistence
- Real-time chat interface

### Admin Features
- User statistics dashboard
- Complete chat log access
- Export functionality for chat histories
- System health monitoring
- Configuration management

## Customization

### Adding New Users
Edit the `DEMO_USERS` dictionary in `utils.py`:

```python
DEMO_USERS = {
    "newuser": {
        "password_hash": "your_hashed_password_here",
        "role": "user",  # or "admin"
        "email": "user@example.com",
        "created_at": "2025-01-01"
    }
}
```

### Enhancing the Chatbot
Replace the `generate_response()` function in `chatbot.py` with:
- OpenAI API integration
- Local AI model (like Ollama)
- Custom ML model
- External API services

### Database Integration
Replace the file-based storage in `utils.py` with:
- SQLite for local database
- PostgreSQL for production
- MongoDB for document storage
- Firebase for cloud solution

## Security Notes

⚠️ **Important:** This is a demo application. For production use:

1. Use proper password hashing (bcrypt, argon2)
2. Implement proper session management
3. Add input validation and sanitization
4. Use environment variables for configuration
5. Implement proper error handling
6. Add rate limiting
7. Use HTTPS in production

## Troubleshooting

### Common Issues

1. **Import errors:** Ensure all dependencies are installed
2. **File not found:** Check that all Python files are in the same directory
3. **Login issues:** Verify credentials match the demo users
4. **Data directory:** The `data/` folder is created automatically

### Development Tips

- Use `streamlit run main.py --server.runOnSave true` for auto-reload
- Check browser console for JavaScript errors
- Use `st.write()` for debugging session state
- Monitor the terminal for Python errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and demonstration purposes.

## Support

For questions or issues, please check the troubleshooting section or create an issue in the repository.
