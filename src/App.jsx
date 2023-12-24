import React from 'react'; 
import { useState , useEffect, useRef} from 'react'
import {lazy,Suspense} from 'react'; 
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'; 
import ErrorBoundary from './components/ErrorBoundary';


const Home = lazy(() => import('./Home')); 
const About = lazy(() => import('./routes/About')); 
import Completion from './routes/Completion';  

function App() {

  return (
    <Router>
     <Routes>
       <Route exact path="/capstone" element={<Home/>}/> 
       <Route exact path="/capstone/about" element={<About/>}/>
       <Route exact path="/capstone/survey/:id" element={<Completion />}/>
      </Routes>     
    </Router>
  )
}

export default App
