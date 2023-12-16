import React from 'react';
import {useEffect, useState, useRef} from 'react'; 
import { useInView } from 'react-intersection-observer'
import completed from '../assets/completed-task.png'
import target from '../assets/target-a.png'

const News = ({loadData, loadDataReady}) =>{
    const [news,setNews] = useState(loadData?.stories ?? []);
   const [carousel, setCarousel] = useState([])
    const [ref,inView] = useInView(); 
 
    useEffect(() =>{
        console.log(loadData); 
       setNews(loadData?.stories ?? []);
    },[loadDataReady])
 useEffect(() => {
  let carousel = new Array(news.length).fill('queued'); 
  carousel[0] = 'first'; 

  setCarousel(carousel); 
 },[])

 useEffect(() =>{
    moveCarousel(); 
 },[carousel])
   
   
   function moveCarousel(){
  setTimeout(() =>{    
    let carouselCopy = [...carousel]; 
       let index = carouselCopy.indexOf('first'); 
     
       
       let rotate = index === carouselCopy.length - 1 ? 0 : index + 1; 
       carouselCopy[rotate] = 'first'; 
       carouselCopy[index] = 'queued'; 
    setCarousel(() => carouselCopy); 
   },5000)   
   }
    

    return (
        <>
        <section className="news-section">
        <div className="news-header">
        <h1>Keep Up To Date ⚡</h1>
        </div>
        <div className="news-cards">
    {news.length ? news.map((segment,i) =>(
   <div className={`card-wrap ${carousel[i]}`} key={i} ref={ref} >
   <span className="author-card">
       <p>{segment?.caption}</p>
       <h3>{`- ${segment?.author}`}</h3>
   </span>
   <div className="news-card">
       <div>
       <p>{segment?.content}</p>
      </div>
   </div>
   </div>
            )) : <div className="no-news">
                <h1>No News Yet 🗞️</h1>
                </div>}
        </div>
        </section>
        </>
    )
}

export default News 