// import { createClient } from 'redis'
// import { getSecretValue } from '../SecretManager/getSecretValue'

// const getClient = async () => {
//     return createClient({ url: await getSecretValue('REDIS_CONNECTION'), password: await getSecretValue('REDIS_PASSWORD'), username: await getSecretValue('REDIS_USERNAME') })
// }

// const clientRedis = getClient()

// const connectToClient = async () => {
//     (await clientRedis).connect()
//         ; (await clientRedis).on('connect', () => {
//             console.log('Redis Connected')
//         })
//         ; (await clientRedis).on('error', (error) => {
//             console.error(error)
//         })
// }
// connectToClient()

// export default clientRedis
