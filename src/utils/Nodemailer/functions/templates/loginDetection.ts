interface Body {
    text: string
    browser: string
    platform: string
    location: string
    ip: string
}

export const loginDetection = (title: string, body: Body) => {
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

        .container{
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

        .info_container{
            text-align: left;
            padding: 0 40px 0 40px;
            background-color: #3fb2ff4d;
        }

        .info_container > li{
            font-weight: 500;
            padding: 5px;
        }

       

        .footer{
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
        <p>${body.text}</p>

        <ul class="info_container">
            <li>${body.browser} (${body.platform})</li>
            <li>${body.location}</li>
            <li>IP: ${body.ip}</li>
        </ul>
     
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
