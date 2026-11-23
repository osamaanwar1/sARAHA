import * as exception from "../utils/exception.js";
import {role} from "../enum/RoleEnum.js";

export const authenticate = (...allowed)=>(req, res, next) => {
    if(!req.user.role.includes(allowed)){
        exception.ForbiddenException('You are not allowed to do this');
    }
    next()
}
export const isOwnerOrAdmin = (req, res, next) => {
    const isOwner = String(req.user._id) === req.params.id
    if(!isOwner&& req.user.role!==role.ADMIN){
        exception.ForbiddenException('You are not allowed to do this');
    }
    next()
}