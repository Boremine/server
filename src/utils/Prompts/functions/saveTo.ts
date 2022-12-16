import Snoowrap from 'snoowrap'
import Client from 'twitter-api-v2'
import axios from 'axios'
// import { createCanvas, loadImage } from 'canvas'

const r = new Snoowrap({
    userAgent: 'Whatever',
    clientId: process.env.REDDIT_CLIENTID,
    clientSecret: process.env.REDDIT_CLIENTSECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
})

export const saveToReddit = (username: string, title: string, text: string, id: string) => {
    r.getSubreddit('boremine')
        .submitSelfpost({
            title,
            text: `By: **${username}**
            \n${text.length > 500 ? `${text.substring(0, 500)}...` : `${text.substring(0, 500)}`}
            \n **See more details about this piece [here](https://boremine.com/mural/${id})**`,
            subredditName: 'boremine',
            sendReplies: false
        })
}

const client = new Client({
    appKey: String(process.env.TWITTER_APP_KEY),
    appSecret: String(process.env.TWITTER_APP_SECRET),
    accessToken: String(process.env.TWITTER_ACCESS_TOKEN),
    accessSecret: String(process.env.TWITTER_ACCESS_SECRET)
})

const rwClient = client.readWrite

export const saveToTwitter = async (username: string, title: string, id: string) => {
    try {
        await rwClient.v2.tweet(`By: ${username}\n\n${title}\n\nSee more details here https://boremine.com/mural/${id}`)
    } catch (e) {
        console.log(e)
    }
}

export const saveToFacebook = async (username: string, title: string, id: string) => {
    await axios({
        url: `https://graph.facebook.com/105203525773591/feed`,
        params: { access_token: process.env.FACEBOOK_ACCESS_TOKEN },
        data: { message: `By: ${username}\n\n${title}\n\nSee more details here https://boremine.com/mural/${id}` },
        method: 'post'
    }).then((res) => {
        // console.log(res)
    }).catch((err) => {
        console.log(err.response)
    })
}

// const printAtWordWrap = (context: any, text: string, x: number, y: number, lineHeight: number, fitWidth: number) => {
//     fitWidth = fitWidth || 0

//     if (fitWidth <= 0) {
//         context.fillText(text, x, y)
//         return
//     }
//     let words = text.split(' ')
//     let currentLine = 0
//     let idx = 1
//     while (words.length > 0 && idx <= words.length) {
//         const str = words.slice(0, idx).join(' ')
//         const w = context.measureText(str).width
//         if (w > fitWidth) {
//             if (idx === 1) {
//                 idx = 2
//             }
//             context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine))
//             currentLine++
//             words = words.splice(idx - 1)
//             idx = 1
//         } else { idx++ }
//     }
//     if (idx > 0) context.fillText(words.join(' '), x, y + (lineHeight * currentLine))
// }

export const saveToInstagram = async (username: string, title: string, id: string) => {
    // await axios({
    //     url: `https://graph.facebook.com/v15.0/100088162437901`,
    //     params: { fields: 'instagram_business_account', access_token: 'EAAJZBZAwkEkoMBAKmDfO7WEB0CuuQd1xp631G0BYuREK5Hfd1VSzY19CdynKqBM7gGzVjk5XYVdHMnPO5ODTr0itm2wQKEVu49Fr8CTWthZBYatzGZAOmsvjM9b5GFNiQewoVZBGv5Rz3eFeLvaKPER7dYz1m02y2sDk8HYupAfAEnoNFh4pZBDvXFGku3nIrPKEevlKuSfrE0PPcrPmyZCInrTHN4mx2fl6zf8iJl6cwZDZD' },
    //     method: 'get'
    // }).then((res) => {
    //     console.log(res.data)
    // }).catch((err) => {
    //     console.log(err.response)
    // })
    // const canvas = createCanvas(1080, 1080)
    // const ctx = canvas.getContext('2d')

    // const background = new Image()
    // background.src = 'https://storage.googleapis.com/boremine.com/background%20banner%20blur%20v3.png'

    // const logo = new Image()
    // logo.src = 'https://storage.googleapis.com/boremine.com/BoremineLogo.png'

    // loadImage('https://storage.googleapis.com/boremine.com/background%20banner%20blur%20v3.png').then((backgroundImage) => {
    //     ctx.drawImage(backgroundImage, 0, 0, 1080, 1080)
    //     loadImage('https://storage.googleapis.com/boremine.com/BoremineLogo.png').then((logoImage) => {
    //         ctx.drawImage(logoImage, 100, 100, 160, 160)
    //     })

    //     ctx.font = 'bold 48px sans-serif'
    //     ctx.textAlign = 'center'

    //     const txt = 'this is a very long text. Some more to print! aseoiasef saejfoi jsdrgo dsrijgdrsoig joesaif jesaoijd rsgoidrsj godisj seaoijesfisejfseaifjsif sejfiesa fjifjaes ofijdrs godrsijg dsroijeas fesaopaij dsrpgoidrsj gpsdroijeas pfoiejsa poidsrj gpodsrijgds rposigjdr pgoidsj'

    //     printAtWordWrap(ctx, txt, 540, 400, 50, 1000)

    //     ctx.fillText('El tete', 800, 200)

    //     // console.log(canvas.toDataURL())
    // })

    // background.onload = function () {
    //     ctx.drawImage(background, 0, 0, 1080, 1080)

    //     ctx.drawImage(logo, 100, 100, 160, 160)

    //     ctx.font = 'bold 48px sans-serif'
    //     ctx.textAlign = 'center'

    //     const txt = 'this is a very long text. Some more to print! aseoiasef saejfoi jsdrgo dsrijgdrsoig joesaif jesaoijd rsgoidrsj godisj seaoijesfisejfseaifjsif sejfiesa fjifjaes ofijdrs godrsijg dsroijeas fesaopaij dsrpgoidrsj gpsdroijeas pfoiejsa poidsrj gpodsrijgds rposigjdr pgoidsj'

    //     printAtWordWrap(ctx, txt, 540, 400, 50, 1000)

    //     ctx.fillText('El tete', 800, 200)
    // }
}
