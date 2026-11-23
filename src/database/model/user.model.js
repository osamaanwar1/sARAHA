import mongoose from "mongoose";
import {gender} from "../../common/enum/genderEnum.js";
import {role} from "../../common/enum/RoleEnum.js";
import {providerEnum} from "../../common/enum/providerEnum.js";
const userSchema= new mongoose.Schema({

    provider: {
        type: String,
        enum: Object.values(providerEnum),
        default: providerEnum.system
    }
    ,
    role: {
        type: String,
        enum: Object.values(role),
        default: role.USER
    },
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: false
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: function () {
            return this.provider === providerEnum.system;
        }
    },

    phone: {
        type: String,
        required: function () {
            return this.provider === providerEnum.system;
        }
    },

    gender: {
        type: Number,
        required: function () {
            return this.provider === providerEnum.system;
        }
    },
},{
    timestamps: true
    ,strict:true
    ,strictQuery:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    autoIndex:true
})
userSchema.virtual("fullName").get(function(){
    return`${this.firstName} ${this.lastName}`;
}).set(function(value){
    const [first,...last] = value.trim().split(' ');
    this.firstName = first;
    this.lastName = last.join(' ');
})
export const User = mongoose.model("User",userSchema);