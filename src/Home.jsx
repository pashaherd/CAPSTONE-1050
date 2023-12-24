import React from 'react'; 
import {useEffect, useState,useRef} from 'react'; 
import {ToastContainer, toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Nav from './components/Nav'
import Showcase from './components/Showcase'; 
import News from './components/News'; 
import Info from './components/Info'; 
import Feed from './components/Feed';
import Surveys from './components/Surveys'; 
import Footer from './components/Footer';  
import Dash from './components/Dash';
import Campaigns from './components/Campaigns'; 
import Default from './components/Default';
import ErrorBoundary from './components/ErrorBoundary'; 


export default function Home(){
   const [isLoggedIn, setLoggedIn] = useState(false); 
    const [initialData, setInitialData]= useState({}); 
    const [loadData, setLoadData] = useState({}); 
    const [loadDataReady, setLoadDataReady] = useState(false); 
     // Init JWT 
  
     useEffect(() => {
       console.log(initialData); 
     },[initialData])
  useEffect(() =>{
   const token = localStorage.getItem('token'); 
   async function init(){
     try{
     const req = await fetch('/init',{method:'GET'});
     const res = await req.json(); 

     if(!res.ok){
       throw new Error(res.msg)
     }

     localStorage.setItem('token', res.token); 

   } catch(e){
     console.log(e.message); 
   }
   }
   async function getLoadData(){
      const loginID = localStorage.getItem('id');
      const id = loginID === 'undefined' ? null : loginID;  
      try{
        const req = await fetch(`/initial/data?login=${isLoggedIn}&id=${id}`, {
         method:'GET',
         headers:{
         'Authorization':`Bearer ${token}`
        },})
        const res = await req.json(); 

        if(res.expired){
         sessionExpired(toast)
        } else if(!res.ok){
         throw new Error(res.msg)
        }
        console.log(`LOAD DATA: ${res}`); 
        console.log(res); 
        setLoadData(res); 
        setLoadDataReady(true); 
        console.log(`THE RES ${res}`); 
      } catch(e){
         console.log(`THE ERR ${e.message}`);
         setLoadData(null); 
      }
   }
   
   if(!token){
   init()
   }
   getLoadData(); 
 },[isLoggedIn])

 function sessionExpired(toast){
   localStorage.clear(); 
   toast.error(res.msg,{position:'top-center', autoClose:3000})
   setTimeout(() =>{
   window.location.reload()
   },3000)
}
 useEffect(() =>{

   
 },[isLoggedIn])

 // Submit Post (Dash)

 async function handleSubmitPost(payload){
   const token = localStorage.getItem('token'); 
   const user = localStorage.getItem('id'); 

   try{
     const req = await fetch('/update/posts', {
      method:'POST',
      headers:{
         'Content-Type':'application/json',
         'Authorization': `Bearer ${token}`
      },
      body:JSON.stringify({...payload,user})
     }); 
     const res = await req.json();  
     if(res.expired){
    sessionExpired(toast)
    return
      }
     if(!res.ok){
      throw new Error(res.msg)
     }
     
     toast.success(res.msg,{position:'top-center',autoClose:3000})
   }catch(e){
      console.log(e.message); 
      toast.error('Post Submit Failed', {position:'top-center', autoClose:3000})
   }
 }

 // Upload Notification
 async function handleNotificationData(payload){
   const token = localStorage.getItem('token'); 
   const user = localStorage.getItem('id'); 
   try{
     const req = await fetch('/upload/notification', {
      method:'POST',
      headers:{
         'Content-Type':'application/json',
         'Authorization':`Bearer ${token}`
      },
      body:JSON.stringify({...payload,user_id:user})
    }); 
    const res = await req.json(); 
    if(res.expired){
      sessionExpired(toast); 
    } else if(!res.ok){
      throw new Error(res.msg); 
    }

    console.log(res); 
    toast.success('Uploaded Successfully', {position:'top-center', autoClose:3000}); 

   }catch(e){
      console.log(e);
      toast.error(e.message, {position:'top-center', autoClose:3000})
   }
 }


 // Handle Goal Submit 

 async function handleGoalSubmit(route,payload){
      const token = localStorage.getItem('token'); 

      try{
        const req = await fetch(route,{
         method:'POST',
         headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
         },
         body:JSON.stringify(payload)
        }); 
        const res = await req.json(); 

        if(res.expired){
         sessionExpired(toast); 
        } else if(!res.ok){
         throw new Error(res.msg); 
        }

        toast.success(res.msg, {position:'top-center', autoClose:3000}); 

      } catch(e){
         console.log(e); 
         toast.error(e.message, {position:'top-center', autoClose:3000}); 
      }
 } 

 // SUbmit Data

 async function getInitialData(id){
   const token = localStorage.getItem('token'); 
   console.log(id); 
   try{
     const req = await fetch(`/login/data/${id}`, {method:'GET', headers:{'Authorization':`Bearer ${token}`}}); 
     const res = await req.json(); 

     if(!res.ok){
      throw new Error(res.msg); 
     }
     
     localStorage.setItem('id',res.employee.employee_id); 

     setInitialData(res);
     setTimeout(() => {
      setLoggedIn(true);
     },1500) 
   } catch(e){
      toast.error('Failed To Set Data', {position:'top-center', autoClose:3000}); 
      console.log(e); 
   }
}

async function submitData(endpoint,payload){
 const isRegister = endpoint.match(/register$/); 
 const token = localStorage.getItem('token'); 


 const viable = JSON.stringify(payload); 
 try{
    const req = await fetch(`${endpoint}`,{
       method:'POST',
       headers:{
           'Content-Type':'application/json',
           'Authorization':`Bearer ${token}`
       },
       body:viable
    }); 
    const res = await req.json(); 
    if(res.expired){
       localStorage.clear(); 
       toast.error(res.msg,{position:'top-center', autoClose:3000});
       window.location.reload(); 
    }
    if(!res.ok){
       throw new Error(res.msg)
    }
   if(isRegister){
    toast.success('Success, Feel Free To Login👍', {position:'top-center', autoClose:3000}); 
   } else {
       
       toast.success(res.msg, {position:'top-center', autoClose:5000}); 
       setTimeout(() =>{
         getInitialData(res.id)  
       },5000)
       
   }
    
 } catch(e){
   console.log(e)
   toast.error(e.message,{position:'top-center', autoClose:3000})
 }
}


// Handle Campaign Search 

  // Block dupes 

  function checkPool(pool,result,isEmployee){
   let s = isEmployee ? "first_name": "survey_title";

      for(let i = 0; i < pool.length; i++){
         if(pool[i][s] === result){
            return false
         }
      }
      return true
  }

async function handleSearch(e,route,setFunction,pool){
   const value = e.target.value;
   const token = localStorage.getItem('token'); 
   
   if(value){

   try{
     const req = await fetch(route,{
      method:'POST',
      headers:{
         'Content-Type':'application/json',
         'Authorization':`Bearer ${token}`
      },
      body:JSON.stringify({query:value})
     }); 

     const res = await req.json(); 
     if(!res.ok){
      throw new Error(res.msg); 
     }
     console.log('Search Res'); 
     console.log(res); 
     const changeResult = route.match(/\/employee$/); 
     const result = changeResult ? res.data.first_name : res.data.survey_title; 

     const notDupe = checkPool(pool,result, changeResult); 
     if(res.data.length){
     setFunction([...pool, ...res.data])
     }
   }catch(e){
      console.log(e); 
      toast.error(e.message,{position:'top-center', autoClose:1000})
   }
}
}

// Submit Campaign Data

async function handleCampaignDataSubmit(e,payload){
   const token = localStorage.getItem('token');
   

   try{
    const req = await fetch('/campaign/submit', {
      method:'POST', 
      headers:{
         'Content-Type':'application/json', 
         'Authorization':`Bearer ${token}`
      },
      body:JSON.stringify(payload)  
    }); 

    const res = await req.json(); 

    if(!res.ok){
      throw new Error(res.msg); 
    }

    toast.success(res.msg,{position:'top-center',autoClose:3000}); 
   }catch(e){
      console.log(e); 
      toast.error(e.message,{position:'top-center', autoClose:3000}); 
   }
}  

// Survey Build Submit

async function handleSurveyBuildSubmit(e,set1,set2){
   const token = localStorage.getItem('token'); 

   try{
     const req = await fetch('/survey/build', {
      method:'POST', 
      headers:{
         'Content-Type':'application/json',
         'Authorization':`Bearer ${token}`
      }, 
      body:JSON.stringify({
         build:set1,
         data:set2
      })
     })

     const res = await req.json(); 
     if(!res.ok){
      throw new Error(res.msg); 
     }
     toast.success(res.msg,{position:'top-center', autoClose:3000}); 
   }catch(e){
      toast.error(e.message, {position:'top-center', autoClose:3000})
   }
}
/// Template Submit 

async function handleSurveyTemplateSubmit(e,set1,set2){
   const token = localStorage.getItem('token'); 

   try{
    const req = await fetch('/survey/template/submit', {
      method:'POST', 
      headers:{
         "Content-Type":'application/json',
         'Authorization':`Bearer ${token}`
      },
      body:JSON.stringify({
         data:set1,
         nest:set2
      })
    });

    const res = await req.json(); 
    if(!res.ok){
      throw new Error(res.msg); 
    }
    toast.success(res.msg, {position:'top-center', autoClose:3000}); 

   } catch(e){
       toast.error(e.message, {position:'top-center', autoClose:3000})
   }
}

// Create Team

async function handleTeamCreation(e,set1,set2){
   const token = localStorage.getItem('token'); 

   try{
    const req = await fetch('/team/create', {
      method:'POST',
      headers:{
         'Content-Type':'application/json',
         'Authorization':`Bearer ${token}`
      }, 
      body:JSON.stringify({name:{...set1}, data:{...set2}})
    }); 

    const res = await req.json(); 
    if(!res.ok){
      throw new Error(res.msg);
    }

    toast.success(res.msg,{position:'top-center', autoClose:3000}); 

   } catch(e){
      console.log(e); 
      toast.error(e.message, {position:'top-center', autoClose:3000}); 
   }
}

// Admin Settings
async function handlePromotion(e){
   const token = localStorage.getItem('token'); 
   const user = localStorage.getItem('id');
   
   console.log('in')
   const target = e.target.parentNode.previousSibling.firstChild.innerHTML; 
   
   try{
      const req = await fetch('/permissions/promote', {
         method:'PATCH',
         headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
         },
         body:JSON.stringify({user,target})
      }); 

      const res = await req.json(); 

      if(!res.ok){
         throw new Error(res.msg)
      }
      toast.success(res.msg, {position:'top-center',autoClose:3000}); 
   }catch(e){
      console.log(e); 
      toast.error(e.message,{position:'top-center', autoClose:3000})
   }
}
async function handleDemotion(e){
   const token = localStorage.getItem('token');
   const user = localStorage.getItem('id'); 
   const target = e.target.parentNode.previousSibling.firstChild.innerHTML; 
   

   try{
      const req = await fetch('/permissions/demote', {
         method:'PATCH',
         headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
         },
         body:JSON.stringify({user,target})
      }); 

      const res = await req.json(); 

      if(!res.ok){
         throw new Error(res.msg)
      }
      toast.success(res.msg, {position:'top-center',autoClose:3000}); 
   }catch(e){
      console.log(e); 
      toast.error(e.message,{position:'top-center', autoClose:3000})
   }
}
     return (
        <>
         <Nav submitData={submitData}/>
         <main>
         <Showcase/>
         <ErrorBoundary></ErrorBoundary>
         { isLoggedIn ? <Dash data={initialData}  handlePromotion={handlePromotion} handleDemotion={handleDemotion} handleTeamCreation={handleTeamCreation} handleSurveyTemplateSubmit={handleSurveyTemplateSubmit} handleSurveyBuildSubmit={handleSurveyBuildSubmit} handleSearch={handleSearch} handleCampaignDataSubmit={handleCampaignDataSubmit} handleGoalSubmit={handleGoalSubmit} sessionExpired={sessionExpired} handleNotificationData={handleNotificationData}handleSubmitPost={handleSubmitPost}/> : <Default className={'default-dash active'}/>}
          <News loadData={loadData} loadDataReady={loadDataReady}/> 
         <Info/>
         <Feed loadData={loadData} loadDataReady={loadDataReady} sessionExpired={sessionExpired}/>
         <Surveys initialData={initialData} isLoggedIn={isLoggedIn}loadData={loadData} sessionExpired={sessionExpired}/>
         <Footer/>
         </main>
         <ToastContainer/>
        </>
     )

}