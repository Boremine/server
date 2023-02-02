import { OAuth2Client } from 'google-auth-library'
import { getSecretValue } from '../../SecretManager/getSecretValue'

const connection = async () => {
    return new OAuth2Client(await getSecretValue('GOOGLEAUTH_CLIENT_ID'), await getSecretValue('GOOGLEAUTH_CLIENT_SECRET'), await getSecretValue('GOOGLEAUTH_REDIRECT_URI'))
}

export const client = connection()
