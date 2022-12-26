import Snoowrap from 'snoowrap'
import Client from 'twitter-api-v2'
import axios from 'axios'
import { createCanvas, loadImage } from 'canvas'

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

const fragmentText = (ctx: any, text: string, maxWidth: number) => {
    const words = text.split(' ')
    const lines = []
    let line = ''
    if (ctx.measureText(text).width < maxWidth) {
        return [text]
    }
    while (words.length > 0) {
        let split = false
        while (ctx.measureText(words[0]).width >= maxWidth) {
            const tmp = words[0]
            words[0] = tmp.slice(0, -1)
            if (!split) {
                split = true
                words.splice(1, 0, tmp.slice(-1))
            } else {
                words[1] = tmp.slice(-1) + words[1]
            }
        }
        if (ctx.measureText(line + words[0]).width < maxWidth) {
            line += words.shift() + ' '
        } else {
            lines.push(line)
            line = ''
        }
        if (words.length === 0) {
            lines.push(line)
        }
    }
    return lines
}

export const saveToInstagram = async (username: string, title: string, text: string, id: string) => {
    // await axios({
    //     url: `https://graph.facebook.com/v15.0/oauth/access_token`,
    //     params: { grant_type: 'fb_exchange_token', client_id: '701930951447171', client_secret: '4f55fbd7908c9d4e2935b7d093cc7d79', fb_exchange_token: 'EAAJZBZAwkEkoMBANEIf49RuJzHl371wDEpF0bxlUeJLRpZAyZCAeiJPtYj9qtHjbwArR81g5ZAtbgpN5pMYaZAiEgyZCP4RVG00Wn5yZCPDxZAlZAJLgFAaD7d6ZAUdw0F33ZCervoFNP6yeNUTVBVzQjcxA1HItlFjr8IUDsUnV0VZBDQwTYKZCZAkhEKrooFnndNFIi7Y1K5pw3Ku1Sq9hWPA2dVHgRlZB2xoXNcotnzsGocXT9wZDZD' },
    //     method: 'get'
    // }).then((res) => {
    //     console.log(res.data)
    // }).catch((err) => {
    //     console.log(err.response)
    // })

    const canvas = createCanvas(1080, 1080)
    const ctx = canvas.getContext('2d')

    loadImage('https://storage.googleapis.com/boremine.com/background%20banner%20blur%20v3.png').then((backgroundImage) => {
        ctx.drawImage(backgroundImage, 0, 0, 1080, 1080)
        loadImage('https://storage.googleapis.com/boremine.com/BoremineLogo.png').then(async (logoImage) => {
            ctx.drawImage(logoImage, 100, 100, 160, 160)

            ctx.font = 'bold 48px arial'
            ctx.textAlign = 'center'

            const txt = title

            const lines = fragmentText(ctx, txt, 1000)

            const baseX = 540
            let baseY = 400
            lines.forEach(function (item) {
                ctx.fillText(item, baseX, baseY)
                baseY += 50
            })

            ctx.fillText(username, 800, 200)

            const base64Canvas = canvas.toDataURL().split(';base64,')[1]

            await axios({
                url: `https://api.imgur.com/3/image`,
                method: 'post',
                headers: {
                    Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    image: base64Canvas
                })
            }).then(async (res) => {
                await axios({
                    url: `https://graph.facebook.com/v15.0/17841454619841492/media`,
                    params: { image_url: res.data.data.link, caption: `${text.length > 500 ? `${text.substring(0, 500)}...` : `${text.substring(0, 500)}`}\nPiece ID: ${id}\n\nWant to know more about boremine? Click the link in this profile!`, access_token: process.env.INSTAGRAM_ACCESS_TOKEN },
                    method: 'post'
                }).then(async (res) => {
                    await axios({
                        url: `https://graph.facebook.com/v15.0/17841454619841492/media_publish`,
                        params: { creation_id: res.data.id, access_token: process.env.INSTAGRAM_ACCESS_TOKEN },
                        method: 'post'
                    }).then((res) => {

                    }).catch((err) => {
                        console.log(err.response.data)
                    })
                }).catch((err) => {
                    console.log(err.response.data)
                })
            }).catch((err) => {
                console.log(err.response.data)
            })
        })
    })
}
