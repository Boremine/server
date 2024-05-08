import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
require('dotenv').config()

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

export const getSecretValue = async (secretName: string): Promise<string | undefined> => {
    return process.env[secretName] || await getSecretValueFromManager(secretName)
}
