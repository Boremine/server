import nodemailer from 'nodemailer'
import { getSecretValue } from '../../SecretManager/getSecretValue'

export const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: await getSecretValue('NODEMAILER_EMAIL'),
            pass: await getSecretValue('NODEMAILER_PASSWORD')
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
