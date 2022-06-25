import { Request, Response, NextFunction } from 'express'
// import { HandleSuccess } from '../../responses/success/HandleSuccess'
// import mongoose from "mongoose";

// import { HandleError } from '../../responses/error/HandleError'

// export const profileAdd = async (req: Request, res: Response, next: NextFunction) => {
//     const {user_id, username} = res.locals
//     let profile = await Profile.findById(user_id)
//     if(profile) return HandleSuccess.Ok(res, 'Welcome Back')
//     const NewProfile = new Profile({
//         _id: new mongoose.Types.ObjectId(user_id),
//         username,
//         something: 'some data'
//     })

//     NewProfile.save()

//     HandleSuccess.Created(res, 'New Profile Created')
// }

export const profileGet = async (req: Request, res: Response, next: NextFunction) => {
    // const locals = res.locals

    res.status(200).json({ message: 'Sucessssss' })
}
