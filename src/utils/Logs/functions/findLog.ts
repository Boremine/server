import { UserAgent } from '../../../types/express-useragent-interface'

interface UserAgentOwners extends UserAgent {
    refreshToken_id: {
        _id: string
        version: number
        token: string
        history: string[]
    }
}

export interface TokenFound {
    _id: string
    token: string
    history: string[]
}

export const findUserAgent = (testAgent: UserAgent | undefined, ownerAgents: Array<UserAgentOwners>) => {
    let tokenFound: TokenFound | boolean = false

    for (let i = 0; i < ownerAgents.length; i++) {
        const log = ownerAgents[i]
        if (!log.refreshToken_id) continue

        tokenFound = {
            _id: log.refreshToken_id._id,
            token: log.refreshToken_id.token,
            history: log.refreshToken_id.history
        }

        if (log.browser !== testAgent?.browser) tokenFound = false
        if (log.platform !== testAgent?.platform) tokenFound = false
        if (log.location !== testAgent?.location) tokenFound = false
        if (log.device !== testAgent?.device) tokenFound = false
        if (log.ip !== testAgent?.ip) tokenFound = false

        if (tokenFound) break
    }
    return tokenFound
}
