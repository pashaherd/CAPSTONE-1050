import React from 'react'; 
import { useState, useEffect, useRef} from 'react'; 
import bar from '../assets/bar-chart.png'; 
import smiling from '../assets/smiling.png'; 
import neutral from '../assets/neutral.png'; 
import angry from '../assets/angry.png'; 
import sad from '../assets/sad.png'; 



const Feed = ({loadData, loadDataReady}) =>{
    const [feed, setFeed] = useState(loadData?.completedSurveys ?? []);
    const [percentages, setPercentages] = useState([]); 
    const [activate, setActivation] = useState([]); 
    const [surveyComments, setSurveyComments] = useState([{name:'John Doe', comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, sit.'},
    {name:'John Doe', comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, sit.'},
    {name:'John Doe', comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, sit.'}])
    const [currentCard, setCurrentCard ]= useState(0); 
    const [transition, setTransition] = useState(false); 
    const [height,setHeight] = useState(0); 
    
    const spanRef = useRef(); 

    useEffect(() =>{
       setFeed(loadData?.completedSurveys ?? [])
       let j = loadData?.completedSurveys ? loadData.completedSurveys.length : 0; 
       let comments = new Array(j).fill(null); 

       for(let i = 0; i < comments.length; i++){
         comments[i] = JSON.parse(loadData.completedSurveys[i]["survey_comments"])
       }

       setSurveyComments(comments); 
    },[loadDataReady])
    

    useEffect(() =>{
     console.log(feed); 
    },[feed])
    useEffect(() =>{
      
        const cardCover = Array.from(document.querySelectorAll('.card-cover')); 
        cardCover.forEach((cover) =>{
           cover.addEventListener('mouseover', (e) =>{
            const currentSpan = e.target.children[0]; 
            const cardInfo = e.target.parentNode.children[2]; 
            // Animate The Cards
            
            cardInfo.classList.add('active'); 
            currentSpan.classList.add('over'); 
            const id = parseInt(e.target.id.split('-')[1]);
            
            setCurrentCard(id); 
            let activationCopy = [...activate]; 
            activationCopy[id] = true; 
            setActivation(activationCopy) 
        
        })
        cover.addEventListener('mouseleave', (e) =>{
            const currentSpan = e.target.children[0];    
          const cardInfo = e.target.parentNode.children[2]; 
            // Animate The Cards
            
            cardInfo.classList.remove('active'); 
            currentSpan.classList.remove('over'); 
            const id = parseInt(e.target.id.split('-')[1]); 
            let activationCopy = [...activate]; 
            activationCopy[id] = false; 
            setActivation(activationCopy) 
        })
        
        cover.addEventListener('click', (e) =>{
           setTransition(true); 
        })
        })
    
    },[transition,feed]);

    useEffect(() =>{
        setPercentages(new Array(feed.length).fill(100));
        setActivation(new Array(feed.length).fill(false));
        
        const newHeight = multipleOf3(feed.length); 
        
        setHeight(newHeight);  
    },[feed.length])

    function gradientAnimation(timestamp,duration){
    setPercentages((prev) =>{
        let copy = [...prev]; 
      let increment = 100 / 60;
      copy[currentCard] -= (increment * duration); 
      return copy
    })
} 

   function reverseAnimation(timestamp, duration){
     setPercentages((prev) =>{
        let copy = [...prev]; 
        let increment = 100 / 60;
        increment *= 1.5;  
         copy[currentCard] += increment
         return copy
        })
   }

    if(percentages[currentCard] > 0 && activate[currentCard]){
        requestAnimationFrame((timestamp) => gradientAnimation(timestamp,.25));
 } else if(percentages[currentCard] < 100 && !activate[currentCard]){
    requestAnimationFrame((timestamp) => reverseAnimation(timestamp,1)); 
 }

function multipleOf3(length){
   let value = 1; 

   while(length > 0){
    length -= 3; 

    if(length > 0){
    value++
}
}
 return value; 
}





    return (
        <section className="feed-wrap">
            <div className="feed-header">
                <h1>Collegue Results 📈</h1>
            </div>
            <div className="feed" style={{height:`100%`}}>
                { transition ? <div className="full-card">
                    <h1>{feed[currentCard]["survey_title"] || 'null'}</h1>
                    <div className="full-card-details">
                        <div className="review-stats">
                            <h2>Overall Rating</h2>
                            <div>
                         <span>
                           <img src={smiling} alt="" className="rating-icon"/> 
                           <p>{feed[currentCard]["survey_rating_good"]}</p>
                        </span>    
                        <span>
                           <img src={neutral} alt="" className="rating-icon"/> 
                           <p>{feed[currentCard]["survey_rating_neutral"]}</p>
                        </span>    
                        <span>
                           <img src={sad} alt="" className="rating-icon"/> 
                           <p>{feed[currentCard]["survey_rating_bad"]}</p>
                        </span>    
                        <span>
                           <img src={angry} alt="" className="rating-icon"/> 
                           <p>{feed[currentCard]["survey_rating_terrible"]}</p>
                        </span> 
                        </div>   
                        </div>
                        <p className="survey-desc-fc">{feed[currentCard]["survey_desc"]}</p>
                        <div className="survey-comments-fc">
                            { surveyComments[currentCard].map((survey,i) =>(
                            <div key={i}>
                                <h3>{survey.author}</h3>
                                <p>{survey.comment}</p>
                            </div>
                            ))}
                        </div>
                        <button className="go-back-btn" onClick={() => setTransition(false)}>Go Back</button>
                    </div>
                </div> : !feed.length ? <div className="no-feed-surveys"><h1>No Survey Results Yet 🤙</h1></div> :feed.map((card,i) =>(
                <div className="feed-card" key={i}>
                    <div className="card-cover" id={`cd-${i}`} style={{background:`linear-gradient(180deg, aquamarine ${percentages[i]}%, rgba(255,255,255,0) 100%)`}}>
                        <span ref={spanRef}>
                        <h1>{card.survey_title}</h1>
                        <p>{`${card.survey_desc.slice(0,12)}...`}</p>
                        </span>
                    </div>
                    <div className="card-fx">
                    </div>
                    
                    <div className="card-info">
                    <p>{card.survey_desc}</p>
                          <div className="card-stats">
                    <span>
                                <img src={bar} alt="" className="card-icon"/>
                                <p>0</p>
                            </span>
                            <span>
                                <img src={bar} alt="" className="card-icon"/>
                                <p>0</p>
                            </span>
                            <span>
                                <img src={bar} alt="" className="card-icon"/>
                                <p>0</p>
                            </span>
                            <span>
                                <img src={bar} alt="" className="card-icon"/>
                                <p>0</p>
                            </span>
                        </div>
                
                    </div> 
                </div>
               ))}
            
            </div>
        </section>
    )
}

export default Feed