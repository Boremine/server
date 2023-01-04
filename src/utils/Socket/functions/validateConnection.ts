import jwt, { VerifyErrors } from 'jsonwebtoken'
import socketIO from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import cookie from 'cookie'
import cookieParser from 'cookie-parser'
import { getSecretValue } from '../../..'

interface Connection {
    socket_id: string
    user_id: string
}

export let authorizeConnections: Array<Connection> = []

export const validateConnections = (io: socketIO.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.on('connection', async (socket) => {
        if (process.env.NODE_ENV === 'development') console.log('user connected', socket.id)
        let allCookies
        if (socket.handshake.headers.cookie) {
            allCookies = cookie.parse(socket.handshake.headers.cookie)
            const signedCookie = cookieParser.signedCookie(allCookies.refresh_token, String(await getSecretValue('COOKIE_PARSER_SECRET')))
            const secret: string = String(await getSecretValue('REFRESH_TOKEN_SECRET'))
            if (signedCookie) {
                jwt.verify(signedCookie, secret, (err: VerifyErrors | null, decoded: any) => {
                    if (err) return
                    if (authorizeConnections.filter(e => e.user_id === decoded.user_id).length === 0) {
                        authorizeConnections.push({ socket_id: socket.id, user_id: decoded.user_id })
                    }
                })
            }
        }

        socket.on('disconnect', () => {
            authorizeConnections = authorizeConnections.filter(e => e.socket_id !== socket.id)
            if (process.env.NODE_ENV === 'development') console.log('user disconnected')
            socket.removeAllListeners()
        })
    })
}
