import React from 'react'; 
import { useState , useEffect, useRef} from 'react'
import {lazy,Suspense} from 'react'; 
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'; 


const Home = lazy(() => import('./Home')); 
const About = lazy(() => import('./routes/About')); 
import Completion from './routes/Completion';  

function App() {

  return (
    <Router>
     <Routes>
       <Route exact path="/" element={<Home/>}/> 
       <Route exact path="/about" element={<About/>}/>
       <Route exact path="/survey/:id" element={<Completion />}/>
      </Routes>     
    </Router>
  )
}

export default App
