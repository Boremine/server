
export const oldEmail = (title:string, username:string, newEmail:string, oldEmail:string) => {
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
    <table class="logo">
        <tr>
            <th>
            // <img class="logo_img" src="cid:logo" width="60"/>
        </th>
        <th>
            <h1 class="logo_text">Boremine</h1>
        </th>
        </tr>
    </table>
    <h2 class="title">${title}</h2>
    <p>Your Boremine account <strong>${username}</strong> is now associated with the email address ${newEmail}.</p>
    <p>You will not longer receive email notifications from Boremine to ${oldEmail}.</p>

    
    <div class="footer">
        <p class="no-replay">This is a notification-only email, Please do not replay to this message.</p>
    </div>
</body>

</html>
    `

    return html
}
