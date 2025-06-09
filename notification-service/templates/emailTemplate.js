
export const createEmailTemplate = (title, message, logoUrl = 'https://res.cloudinary.com/dc6hczfu5/image/upload/v1749466354/logo_dar_el_messa_vcx0jd.png') => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px 20px;
                text-align: center;
                color: white;
            }
            
            .logo {
                max-width: 120px;
                height: auto;
                margin-bottom: 15px;
                border-radius: 8px;
            }
            
            .platform-name {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .tagline {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .title {
                font-size: 22px;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .message {
                font-size: 16px;
                line-height: 1.8;
                color: #555;
                margin-bottom: 30px;
                text-align: left;
            }
            
            .cta-button {
                display: block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white !important;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                text-align: center;
                margin: 20px auto;
                width: fit-content;
                transition: transform 0.2s ease;
            }
            
            .cta-button:hover {
                transform: translateY(-2px);
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 25px 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            
            .footer-text {
                font-size: 14px;
                color: #6c757d;
                margin-bottom: 10px;
            }
            
            .social-links {
                margin-top: 15px;
            }
            
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #667eea;
                text-decoration: none;
                font-size: 14px;
            }
            
            .divider {
                height: 2px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 20px 0;
                border-radius: 1px;
            }
            
            @media only screen and (max-width: 600px) {
                .email-container {
                    margin: 10px;
                    border-radius: 5px;
                }
                
                .content {
                    padding: 25px 20px;
                }
                
                .header {
                    padding: 25px 15px;
                }
                
                .title {
                    font-size: 20px;
                }
                
                .message {
                    font-size: 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="${logoUrl}" alt="Platform Logo" class="logo">
                <div class="platform-name">E-Learning Platform</div>
                <div class="tagline">Empowering Education Through Technology</div>
            </div>
            
            <div class="content">
                <h1 class="title">${title}</h1>
                <div class="divider"></div>
                <div class="message">${message}</div>
                
                <a href="https://your-platform-domain.com/dashboard" class="cta-button">
                    Visit Dashboard
                </a>
            </div>
            
            <div class="footer">
                <div class="footer-text">
                    Thank you for being part of our learning community!
                </div>
                <div class="footer-text">
                    © 2024 E-Learning Platform. All rights reserved.
                </div>
                
                <div class="social-links">
                    <a href="#">Privacy Policy</a> |
                    <a href="#">Terms of Service</a> |
                    <a href="#">Contact Support</a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};