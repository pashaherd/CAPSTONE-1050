import { useState , useEffect, useRef} from 'react'
import {lazy,Suspense} from 'react'; 
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'; 


const Home = lazy(() => import('./Home'));  

function App() {
  

  return (
    <Router>
     <Routes>
       <Route exact path="/" element={<Home/>}/> 
      </Routes>     
    </Router>
  )
}

export default App
