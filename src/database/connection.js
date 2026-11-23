import mongoose from 'mongoose'
import conf from './../config/config.service.js'
export const connection=  async()=>{
    try{
        await mongoose.connect(conf.uri)
        console.log('db connection started');
    }
    catch(e){
console.log(e);
process.exit(1);
    }
}