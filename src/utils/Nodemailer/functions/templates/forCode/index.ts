
export const forCode = (title:string, code:string) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500&display=swap" rel="stylesheet"> -->
        <title>${title}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');
            body {
                font-family: 'Rubik', sans-serif;
        
            }
    
            .container{
                width: 30rem;
                margin: auto;
                text-align: center;
            }
    
            .logo {
                font-size: 30px !important;
                font-weight: 600;
                /* margin-bottom: 50px; */
            }
    
            .title {
                font-size: 20px !important;
                font-weight: 600;
                /* margin-bottom: 11px; */
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
    
            .footer{
                width: 30rem;
                margin: auto;
                text-align: center;
    
                margin-top: 50px;
            }
    
            .no-replay{
                font-size: 10px !important;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <h1 class="logo">Boremine</h1>
            <h2 class="title">${title}</h2>
            <p class="text">Enter this confirmation code:</p>
            <h3 class="code">${code}</h3>
        </div>
        <div class="footer">
            <p class="no-replay">This is a notification-only email, Please do not replay to this message.</p>
        </div>
    </body>
    
    </html>
    `
    return html
}
