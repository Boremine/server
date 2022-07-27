import crypto from 'crypto'

export const encrypt = (text: string) => {
    // const algorithm = 'aes-256-ctr'
    const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'
    // // const iv = crypto.randomBytes(16)
    const ivBuffer = Buffer.alloc(0)
    // const cipher = crypto.createCipheriv(algorithm, secretKey, 'fiegjs9f')

    // const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

    // return encrypted

    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, ivBuffer)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    console.log(crypted)
    return crypted

    // return {
    //     iv: iv.toString('hex'),
    //     content: encrypted.toString('hex')
    // }
}

export const decrypt = (hash: string) => {
    // const algorithm = 'aes-256-ctr'
    const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'
    const ivBuffer = Buffer.alloc(0)
    // const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from('fiegjs9f', 'hex'))

    // const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()])

    // return decrpyted.toString()

    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, ivBuffer)
    let dec = decipher.update(hash, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
}
