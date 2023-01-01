import Snoowrap from 'snoowrap'
import Client from 'twitter-api-v2'
import axios from 'axios'
import { createCanvas, loadImage } from 'canvas'
import { getSecretValue } from '../../..'

export const saveToReddit = async (username: string, title: string, text: string, id: string) => {
    const r = new Snoowrap({
        userAgent: 'Whatever',
        clientId: await getSecretValue('REDDIT_CLIENTID'),
        clientSecret: await getSecretValue('REDDIT_CLIENTSECRET'),
        username: await getSecretValue('REDDIT_USERNAME'),
        password: await getSecretValue('REDDIT_PASSWORD')
    })

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

export const saveToTwitter = async (username: string, title: string, id: string) => {
    const client = new Client({
        appKey: String(await getSecretValue('TWITTER_APP_KEY')),
        appSecret: String(await getSecretValue('TWITTER_APP_SECRET')),
        accessToken: String(await getSecretValue('TWITTER_ACCESS_TOKEN')),
        accessSecret: String(await getSecretValue('TWITTER_ACCESS_SECRET'))
    })

    const rwClient = client.readWrite

    try {
        await rwClient.v2.tweet(`By: ${username}\n\n${title}\n\nSee more details here https://boremine.com/mural/${id}`)
    } catch (e) {
        console.log(e)
    }
}

export const saveToFacebook = async (username: string, title: string, id: string) => {
    await axios({
        url: `https://graph.facebook.com/105203525773591/feed`,
        params: { access_token: await getSecretValue('FACEBOOK_ACCESS_TOKEN') },
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
                    Authorization: `Client-ID ${await getSecretValue('IMGUR_CLIENT_ID')}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    image: base64Canvas
                })
            }).then(async (res) => {
                await axios({
                    url: `https://graph.facebook.com/v15.0/17841454619841492/media`,
                    params: { image_url: res.data.data.link, caption: `${text.length > 500 ? `${text.substring(0, 500)}...` : `${text.substring(0, 500)}`}\nPiece ID: ${id}\n\nWant to know more about boremine? Click the link in this profile!`, access_token: await getSecretValue('INSTAGRAM_ACCESS_TOKEN') },
                    method: 'post'
                }).then(async (res) => {
                    await axios({
                        url: `https://graph.facebook.com/v15.0/17841454619841492/media_publish`,
                        params: { creation_id: res.data.id, access_token: await getSecretValue('INSTAGRAM_ACCESS_TOKEN') },
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
