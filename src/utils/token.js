const TOKENKEY = 'token_key'
function setToken(token){
    window.localStorage.setItem(TOKENKEY,token)
}
function getToken(){
    return window.localStorage.getItem(TOKENKEY) 
}
function removeToken(){
    window.localStorage.removeItem(TOKENKEY) 
}
export {setToken,getToken,removeToken}