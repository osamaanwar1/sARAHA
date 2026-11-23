export function createError(m,num){
    const err=new Error(m)
    err.code=num
    return err
}