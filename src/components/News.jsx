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
<<<<<<< HEAD
    

    return (
        <>
=======

// const userrole = "admin";
const userrole = "user";

    return (
        <>
        <div className="analytics">
        {userrole === "admin" ? (
          <>
            <div>
              <img src={completed} alt="" className="analytic-icon" />
              <span>
                <p>Completed Surveys</p>
                <h3>100</h3>
              </span>
            </div>
 
            <div>
              <img src={target} alt="" className="analytic-icon" />
              <span>
                <p>Assigned Target</p>
                <h3>100</h3>
              </span>
            </div>
          </>
        ) : (
          <>
            <div>
              <img src={target} alt="" className="analytic-icon" />
              <span>
                <p>User</p>
                <h3>Salome Abarca</h3>
              </span>
            </div>

            <div>
              <img src={target} alt="" className="analytic-icon" />
              <span>
                <p>Email</p>
                <h3>salome.abarca@xyz.ca</h3>
              </span>
            </div>

            <div>
              <img src={target} alt="" className="analytic-icon" />
              <span>
                <p>Phone</p>
                <h3>555-666-7777</h3>
              </span>
            </div>
          </>
        )}
        </div>



>>>>>>> origin/master
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












