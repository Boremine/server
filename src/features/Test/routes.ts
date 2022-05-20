import { Router } from 'express'
const router: Router = Router()


router.get('/', (req, res) =>{
    let authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    
    res.sendStatus(200)
})



export default router