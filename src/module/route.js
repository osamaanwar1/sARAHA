import {Router} from 'express'
import {router} from "./auth/auth.route.js";
export const mainRouter = Router()
mainRouter.use('/auth',router)