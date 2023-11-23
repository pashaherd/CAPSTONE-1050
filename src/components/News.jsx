import React from 'react';
import {useEffect, useState, useRef} from 'react'; 
import { useInView } from 'react-intersection-observer'
import completed from '../assets/completed-task.png'
import target from '../assets/target-a.png'

const News = () =>{
    const [news,setNews] = useState([{caption:'I Love Kobe Bryant', author:
'His Greatest Fan', text:'I Love Kobe Because he is Kobe'},{caption:'I Love Martha Stewart', author:
'Her Biggest Fan', text:'I Love Martha Stewart Because She is Martha Stewart'}, {caption:'I Love Shaquelle O\'Neal', author:'His Biggest Fan', text:'I Love Shaquelle Because He is Shaquelle'}]);
   const [carousel, setCarousel] = useState([])
    const [ref,inView] = useInView(); 

 useEffect(() => {
  let carousel = new Array(news.length).fill('queued'); 
  carousel[0] = 'first'; 

  setCarousel(carousel); 
 },[])

 useEffect(() =>{
console.log(carousel); 
 },[carousel])

 useEffect(() =>{
    moveCarousel(); 
 },[carousel])
   console.log(inView); 
   
   function moveCarousel(){
  setTimeout(() =>{
    console.log('in view');    
    let carouselCopy = [...carousel]; 
       let index = carouselCopy.indexOf('first'); 
       console.log(carouselCopy.length); 
     
       
       let rotate = index === carouselCopy.length - 1 ? 0 : index + 1; 
       carouselCopy[rotate] = 'first'; 
       carouselCopy[index] = 'queued'; 
    setCarousel(carouselCopy); 
   },5000)   
   }
 

    return (
        <>
        <div className="analytics">
            <div>
                <img src={completed} alt="" className="analytic-icon"/>
                <span>
                    <p>Completed Surveys</p>
                    <h3>100</h3>
                </span>
            </div>
            <div>
                <img src={target} alt="" className="analytic-icon"/>
                <span>
                    <p>Assigned Target</p>
                    <h3>100</h3>
                </span>
            </div>
        </div>
        <section className="news-section">
        <div className="news-header">
        <h1>Keep Up To Date ⚡</h1>
        </div>
        <div className="news-cards">
    {news.map((segment,i) =>(
   <div className={`card-wrap ${carousel[i]}`} key={i} ref={ref} >
   <span className="author-card">
       <p>{segment.caption}</p>
       <h3>{`- ${segment.author}`}</h3>
   </span>
   <div className="news-card">
       <div>
       <p>{segment.text}</p>
      </div>
   </div>
   </div>
            ))}
        </div>
        </section>
        <div style={{width:'100%', height:'100vh'}}></div>
        </>
    )
}

export default News 