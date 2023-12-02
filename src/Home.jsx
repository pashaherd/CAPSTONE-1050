import React from 'react'; 
import {useEffect, useState,useRef} from 'react'; 
import Nav from './components/Nav'
import Showcase from './components/Showcase'; 
import News from './components/News'; 
import Info from './components/Info'; 
import Feed from './components/Feed';
import Surveys from './components/Surveys'; 
import Footer from './components/Footer';  

export default function Home(){
     return (
        <>
         <Nav/>
         <main>
         <Showcase/>
         <News/> 
         <Info/>
         <Feed/>
         <Surveys/>
         <Footer/>
         </main>
        </>
     )

}