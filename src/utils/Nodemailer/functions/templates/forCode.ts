
export const forCode = (title:string, code:string) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
    
            body {
                font-family: 'Rubik', sans-serif;
    
            }
    
            .container {
                width: 30rem;
                margin: auto;
                text-align: center;
            }
    
            .logo {
                margin: auto;
            }
    
            .logo_text {
                font-size: 30px !important;
                font-weight: 600;
            }
    
            .title {
                font-size: 20px !important;
                font-weight: 600;
                margin: 10px;
            }
    
            .text {
                font-size: 13px !important;
                margin-top: 50px;
            }
    
            .code {
                font-size: 50px;
                font-weight: 600;
                background-color: #3fb2ff4d;
                padding: 10px;
                margin: 0;
            }
    
            .footer {
                width: 30rem;
                margin: auto;
                text-align: center;
                font-size: 10px !important;
                margin-top: 50px;
            }
    
           
        </style>
    </head>
    
    <body>
        <div class="container">
            <table class="logo">
                <tr>
                    <th>
                    <img class="logo_img" src="https://storage.googleapis.com/boremine.com/BoremineLogo.png" width="60"/>
                </th>
                <th>
                    <h1 class="logo_text">Boremine</h1>
                </th>
                </tr>
            </table>
            <h2 class="title">${title}</h2>
            <p class="text">Enter this confirmation code</p>
            <h3 class="code">${code}</h3>
        </div>
        <div class="footer">
            <p>This is a notification-only email, Please do not replay to this message.</p>
            <p>You can contact boremine at contact@boremine.com</p>
        </div>
    </body>
    
    </html>
    `
    return html
}
