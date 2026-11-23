import {login, loginWithTheGoogle, refreshTokenf, signup} from "./auth.service.js";
import {response} from "../../common/utils/response.js";
import {createLoginCredentials, generateToken} from "../../common/security/token.js";

export async function signupC(req, res) {
    const user =await signup(req.body)
   response({res,status:200,data:user,message:"signup successfully"})
}
export async function loginC(req, res) {
    const credentials =await login(req.body)
    response({res,status:200,data:credentials,message:"login successfully"})
}
export async function rotate(req, res) {
    let {accessToken,refreshToken}=refreshTokenf(req.user,req.payload)
    response({res,status:200,data:{accessToken,refreshToken},message:"refresh done successfully"})
}
export async function profileC(req, res) {
    response({
        res,
        status: 200,
        data: req.user,
        message: 'Profile fetched successfully'
    });
}
export async function loginWithGoogle(req,res,next) {
    let data = await loginWithTheGoogle(req.body)
    response({res,status:200,data:data,message:"login successfully"})

}