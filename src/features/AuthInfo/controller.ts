import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'

import { HandleError } from '../../responses/error/HandleError'

import { HandleSuccess } from '../../responses/success/HandleSuccess'
import { checkIfFirstFive } from '../../utils/Prompts/functions/checkIfFirstFive'

import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

const client = new SecretManagerServiceClient()

const getSecretValue = async (secretName: string) => {
    const [secret] = await client.accessSecretVersion({
        name: secretName
    })
    console.log(secret.payload)
    // if (secret.payload) console.log(secret.payload.data.toString())
    // return secret.payload.data.toString()
}

export const getAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = res.locals

    const user = await User.findById(user_id).lean().populate([{
        path: 'logs',
        select: 'browser ip device platform location machine _id'
    }, {
        path: 'prompt_id',
        select: '_id title text'
    }
    ]).select('usernameDisplay email alreadyVoted lastUsernameUpdate prompt_id _id')

    if (!user) return next(HandleError.Unauthorized("User doesn't exist"))

    if (user.prompt_id) {
        user.prompt_id.promptInFirstFive = await checkIfFirstFive(user.prompt_id._id)
    }

    await getSecretValue('projects/boremine/secrets/TEST_ENV')

    HandleSuccess.Ok(res, { ...user, auth: true })
}
