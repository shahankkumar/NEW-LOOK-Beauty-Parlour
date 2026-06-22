const fs = require('fs');
fetch('https://api.cloudinary.com/v1_1/dtcplxf4a/video/upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    upload_preset: 'uw-preset-123',
    file: 'data:video/mp4;base64,AAAA'
  })
}).then(res => res.json()).then(data => console.log("CLOUDINARY_RESPONSE:", data)).catch(err => console.error(err));
