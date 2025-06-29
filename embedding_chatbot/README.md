# Digital Pro Assist Chatbot

A beautiful, animated, and fully embeddable chatbot widget that can be integrated into any website with a simple script tag.

## ✨ Features

- 🎨 **Beautiful UI**: Modern design with smooth animations and responsive layout
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🔌 **Easy Integration**: Just one script tag to embed in any website
- 🔒 **Secure API**: API key authentication for secure communication
- 💬 **Real-time Chat**: Instant messaging with typing indicators and animations
- ⚡ **Lightweight**: Minimal footprint with optimized performance

## 🚀 Quick Start

### Basic Integration

Add this single script tag to your HTML:

```html
<script src="https://your-domain.com/embedding.js" apiKey="your-api-key"></script>
```

### Custom Container

Specify a custom container for the chatbot:

```html
<!-- HTML -->
<div id="my-chatbot-container"></div>

<!-- Script with custom container -->
<script src="https://your-domain.com/embedding.js" 
        apiKey="your-api-key" 
        container="#my-chatbot-container"></script>
```

### Manual Initialization

For more control, initialize manually:

```html
<script src="https://your-domain.com/embedding.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    DigitalProAssist.init('your-api-key', '#custom-container');
});
</script>
```

## 📂 File Structure

```
embedding_chatbot/
├── chatbot.html          # Standalone demo page
├── chatbot-widgets.js     # Main chatbot widget logic
├── embedding.js          # Embedding script for integration
├── demo.html            # Integration demo page
└── README.md            # This documentation
```

## 🌐 API Integration

The chatbot communicates with your webhook endpoint:

### Endpoint
```
POST https://n8n.anakanjeng.site/webhook-test/chatbot-digital-pro-assist
```

### Request Format
```json
{
  "apiKey": "your-api-key",
  "message": "user message"
}
```

### Response Format
```json
{
  "response": "bot response message"
}
```

## 🎨 Customization

### Styling

The chatbot comes with a beautiful default theme, but you can customize it by overriding CSS variables:

```css
.chatbot-widget {
    --primary-color: #007bff;
    --primary-hover: #0056b3;
    --background-color: #ffffff;
    --text-color: #333333;
    --border-radius: 20px;
}
```

### Widget Position

By default, the widget appears in the bottom-right corner. You can change this by modifying the CSS:

```css
.chatbot-widget {
    bottom: 20px;
    left: 20px; /* Move to left side */
    right: auto;
}
```

## 🔧 Configuration Options

### Script Attributes

| Attribute | Description | Required | Default |
|-----------|-------------|----------|---------|
| `apiKey` | Your unique API key | Yes | - |
| `container` | CSS selector for custom container | No | Creates floating widget |

### JavaScript API

```javascript
// Initialize manually
const chatbot = DigitalProAssist.init('api-key', '#container');

// Check version
console.log(DigitalProAssist.version);
```

## 📱 Responsive Design

The chatbot automatically adapts to different screen sizes:

- **Desktop**: Floating widget with hover effects
- **Tablet**: Optimized touch interactions
- **Mobile**: Full-width modal on small screens

## 🔒 Security

- API key authentication for all requests
- Input sanitization and validation
- HTTPS communication required
- No sensitive data stored in browser

## 🚀 Deployment

1. **Upload Files**: Upload all files to your web server
2. **Update URLs**: Update the script src in `embedding.js` to your domain
3. **Configure API**: Ensure your webhook endpoint is accessible
4. **Test Integration**: Use the demo.html to test the integration

### Example Server Structure

```
your-website.com/
├── chatbot/
│   ├── embedding.js
│   ├── chatbot-widgets.js
│   └── demo.html
└── index.html (your main site)
```

### Integration in Your Site

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- Add this before closing body tag -->
    <script src="https://your-website.com/chatbot/embedding.js" 
            apiKey="client-unique-api-key"></script>
</body>
</html>
```

## 🐛 Troubleshooting

### Common Issues

1. **Chatbot not appearing**
   - Check that the API key is provided
   - Verify script URLs are correct
   - Check browser console for errors

2. **API errors**
   - Verify webhook endpoint is accessible
   - Check API key format
   - Ensure proper CORS headers

3. **Styling issues**
   - Check for CSS conflicts
   - Verify z-index values
   - Test on different devices

### Debug Mode

Enable debug logging:

```javascript
// Add to your page before the embedding script
window.DIGITAL_PRO_ASSIST_DEBUG = true;
```

## 📞 Support

For technical support or questions:

- 📧 Email: contact@digitalproassist.com
- 📞 Phone: +6281234567890

## 📄 License

This project is proprietary software. All rights reserved.

---

*Created with ❤️ by Digital Pro Assist Team*
