import { createClient } from 'redis'

import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

const secretManagerClient = new SecretManagerServiceClient()

const getSecretValueFromManager = async (secretName: string) => {
    const path = `projects/boremine/secrets/${secretName}/versions/latest`
    try {
        const [secret] = await secretManagerClient.accessSecretVersion({
            name: path
        })
        return secret.payload?.data?.toString()
    } catch {
        return undefined
    }
}

const getSecretValue = async (secretName: string): Promise<string | undefined> => {
    return process.env[secretName] || await getSecretValueFromManager(secretName)
}

const getClient = async () => {
    return createClient({ url: await getSecretValue('REDIS_CONNECTION'), password: await getSecretValue('REDIS_PASSWORD'), username: await getSecretValue('REDIS_USERNAME') })
}

const clientRedis = getClient()

const connectToClient = async () => {
    (await clientRedis).connect()
        ; (await clientRedis).on('connect', () => {
            console.log('Redis Connected')
        })
        ; (await clientRedis).on('error', (error) => {
            console.error(error)
        })
}
connectToClient()

export default clientRedis
