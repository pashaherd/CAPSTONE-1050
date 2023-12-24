import React from 'react'; 
import { useState, useEffect} from 'react'; 
import {Link} from 'react-scroll';

const Footer = () =>{
   const [isAboutPage, setAboutPage] = useState(false); 
    
   useEffect(() =>{
      if(window.location.pathname.match(/\/about/)){
        setAboutPage(true) 
      } else{
        setAboutPage(false)
      }
   },[])
    function scroll(){ 
        window.scrollTo({
            top:0,
            behavior:'smooth'
        })
    }
    return (
        <footer>
            <div className="back-to-top">
                <div><button onClick={()=> scroll()}>Back To Top</button></div>
            </div>
        <div className="footer-logo"><p>logo</p></div>
        <ul className="footer-links">
           {isAboutPage && <li><a href="/capstone">Return</a></li>}
        </ul>
        </footer>
    )
}


export default Footer