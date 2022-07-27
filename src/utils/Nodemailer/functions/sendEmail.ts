import nodemailer from 'nodemailer'

export const sendEmail = (to:string, subject:string, html:string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    })

    transporter.sendMail({
        from: 'Boremine <noreply@boremine.com>',
        to,
        subject,
        html
    }, function (err, info) {
        if (err) {
            console.log('Invalid email address')
        }
    })
}
