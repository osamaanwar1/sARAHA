import * as crypto from "node:crypto";
import * as config from "./../../config/config.service.js";

const ENC_ALGO = config.default.ENC_ALGO;
const ENC_IV_LENGTH = config.default.ENC_IV_LENGTH
const Enc_key=config.default.ENC_KEY
const KEY=Buffer.from(Enc_key,'hex')
export const encrypt = (text) => {
    const iv=crypto.randomBytes(ENC_IV_LENGTH)
    const cipher =crypto.createCipheriv(ENC_ALGO,KEY,iv)
    const encrypted = Buffer.concat([cipher.update(text,'utf-8'),cipher.final()])
    const tag = cipher.getAuthTag();
    return [iv, tag, encrypted].map((b) => b.toString("hex")).join(":");
}
export const decrypt = (payload) => {
    const [iv,tag,encrypted] = payload.split(":").map((a)=>Buffer.from(a,'hex'));
    const dec=crypto.createDecipheriv(ENC_IV_LENGTH,KEY,iv)
    dec.setAuthTag(tag)
    return Buffer.concat([dec.update(encrypted),dec.final()]).toString('utf-8')
}