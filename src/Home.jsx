import React from 'react'; 
import {useEffect, useState,useRef} from 'react'; 
import Nav from './components/Nav'
import Showcase from './components/Showcase'; 
import News from './components/News'; 
import Info from './components/Info'; 
import Feed from './components/Feed'; 

export default function Home(){
     return (
        <>
         <Nav/>
         <main>
         <Showcase/>
         <News/> 
         <Info/>
         <Feed/>
         </main>
        </>
     )

}