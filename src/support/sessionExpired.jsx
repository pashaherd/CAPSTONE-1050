export default function sessionExpired(toast){
    localStorage.clear(); 
    toast.error(res.msg,{position:'top-center', autoClose:3000})
    setTimeout(() =>{
    window.location.reload()
    },3000)
}