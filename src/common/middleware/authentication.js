import {tokenType} from "../enum/tokentype.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import * as exceptions from "../utils/exception.js";

import {verifyToken} from "../security/token.js";
import {User} from "../../database/model/user.model.js";
import {compareHash} from "../security/hash.js";
export const authentication = (type=tokenType.ACCESS)=> asyncHandler(async (req, res, next)=>{
const [scheme,token]=(req.headers.authorization ?? '').split(' ')
    if(!token){
         exceptions.UnauthorizedException('Missing or malformed token');
    }
    switch (scheme) {
        case "Bearer":{
            const payload =verifyToken(token,type);
            const user = await User.findById(payload.sub);
            if (!user) exceptions.UnauthorizedException('User no longer exists');
            if(user.credentialsChangedAt&& payload.iat *1000 <user.credentialsChangedAt.getTime()){
                exceptions.UnauthorizedException('Please login again');
            }
            req.user = user;
            req.payload = payload;
            break}
        case "basic":{
            const data= Buffer.from(token,'base64').toString();
            const [email,password]= data.split(':')
            const user= User.findone({email})
            if(!user){
                exceptions.UnauthorizedException('invalid credintals ');
            }
            const isTrue=await compareHash({ plainText: password, hashed: user.password })
            if(!isTrue){
                exceptions.UnauthorizedException('invalid credintals ');
            }
        break}
            default:
                exceptions.UnauthorizedException('scheme not used');
    }
next()

}
)

