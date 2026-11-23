import {Router} from "express"
import {asyncHandler} from "../../common/utils/asyncHandler.js";
import {loginC,  loginWithGoogle, profileC, rotate, signupC} from "./auth.controller.js";
import {authenticate} from "../../common/middleware/authorization.js";
import {tokenType} from "../../common/enum/tokentype.js";
import {authentication} from "../../common/middleware/authentication.js";
export const router=Router()
// auth.route.js
router.post('/signup', asyncHandler(signupC));
router.post('/login',  asyncHandler(loginC));
router.post('/refresh',authentication(tokenType.REFRESH),asyncHandler(rotate));
router.get(
    '/profile',
    authentication(tokenType.ACCESS),
    asyncHandler(profileC)
);
router.post('/loginWithGmail',asyncHandler(loginWithGoogle))

// router.get('/profile', authentication(), asyncHandler(profileC));
// router.delete('/users/:id', authentication(), authorization(RoleEnum.ADMIN), asyncHandler(deleteUserC));
// router.patch('/users/:id', authentication(), isOwnerOrAdmin, asyncHandler(updateUserC));