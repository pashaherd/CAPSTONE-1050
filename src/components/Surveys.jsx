import React from 'react'; 
import {useState, useEffect} from 'react';
import info from '../assets/info.png'
import arrow from '../assets/arrow.png'
import stats from '../assets/bar-chart.png'; 

const Surveys = () =>{
    const [surveysInProgress, setSurveysInProgress] = useState([{title:'Survey',
progress:50,}, {title:'Survey',
progress:50,},{title:'Survey',
progress:50,},{title:'Survey',
progress:50,},{title:'Survey',
progress:50,},{title:'Survey',
progress:50,},{title:'Survey', progress:40}]); 

const [surveys, setSurveys] = useState([{title:'New Survey', brief:'Brief Survey Description',stat:'Survey Count',statNum:1000},{title:'New Survey', brief:'Brief Survey Description',stat:'Survey Count',statNum:1000},{title:'New Survey', brief:'Brief Survey Description',stat:'Survey Count',statNum:1000},{title:'New Survey', brief:'Brief Survey Description',stat:'Survey Count',statNum:1000},{title:'New Survey', brief:'Brief Survey Description',stat:'Survey Count',statNum:1000}])
const [surveyCarousel, setSurveyCarousel] = useState(new Array(surveys.length).fill('off'))

useEffect(() => {
     let carousel = [...surveyCarousel]; 
     let j = carousel.length - 1; 
     
     carousel[j] = 'prev'; 
     carousel[0] = 'current'; 
     carousel[1] = 'next'; 

     setSurveyCarousel(carousel)
},[surveys])

useEffect(() =>{
  console.log(surveyCarousel); 
},[surveyCarousel])

    function moveCarousel(method){
        let carousel = [...surveyCarousel]; 
        let j = carousel.length - 1; 

        let current = carousel.indexOf('current') + (method === 'forward' ? 1 : -1);  
        let prev = carousel.indexOf('prev') + (method === 'forward' ? 1 : -1); 
        let next = carousel.indexOf('next') + (method === 'forward' ? 1 : -1);  
        
        if(method === 'forward'){
            let index1 = j < current ? 0 : current; 
            let index2 = j < prev ? 0 : prev; 
            let index3 = j < next ? 0 : next;    

        carousel[index1] = 'current'; 
        carousel[index2] = 'prev'; 
        carousel[index3] = 'next'; 

        for(let i = 0; i < carousel.length; i++){
            if(![index1,index2,index3].includes(i)){
                carousel[i] = 'off'; 
            }
        }
        } else {
            let index1 = current < 0 ? j : current; 
            let index2 = prev < 0 ? j : prev;
            let index3 = next < 0 ? j : next; 

            carousel[index1] = 'current'; 
            carousel[index2] = 'prev'; 
            carousel[index3] = 'next';
            
            for(let i = 0; i < carousel.length; i++){
                if(![index1,index2,index3].includes(i)){
                    carousel[i] = 'off'
                }
            }
        }

        setSurveyCarousel(carousel); 
    }
    return (
        <section className="survey-wrap">
            <div className='header-wrap-survey'>
            <div className="header-survey">
            <h1>Surveys 📜</h1>
            </div>
            <div className="header-notification">
                <span>
                    <img src={info} alt="" className="header-icon"/>
                    <p>Looks Like Your Not Signed in, Sign In <a href="#">Here</a></p>
                </span>
            </div>
            </div>
            <div className="survey-body">
                <div className="survey-carousol">
                    <div className="incompleted-tab">
                        <p>Incompleted Surveys </p>
                    </div>
                  <div className="incompleted-wrap">
                  {surveysInProgress.map((survey,i) =>(
                    <div className="incompleted-survey" key={i}>
                        <div className="header-incompleted">
                            <h3>{survey.title}</h3>
                             <div className="progress-bar">
                                <p>{`${survey.progress}%`}</p>
                                <div className="meter-cover">
                                    <div className="meter" style={{background:`linear-gradient(90deg,rgba(0,255,0,0.5) ${survey.progress}%, white 0% )`}}></div>
                                </div>
                             </div>
                        </div>
                        <div className="btn-incompleted"><button>Continue</button></div>
                    </div>
                    ))}
                  </div>
                </div>
                <div className="survey-carousol-body">
                    <h1>Start New</h1>
                    <div className="carousol-body">
                        <div className="carousol-cards">
                            {surveys.map((survey,i) =>(
                                 <div className={`cc ${surveyCarousel[i]}`} key={i}>
                                    <span className="survey-card-header">
                                        <h2>{survey.title}</h2>
                                        <p>{survey.brief}</p>
                                    </span>
                                    <div className="survey-start-btn"><button>Start</button></div>
                                    <div className="new-survey-stats">
                                        <div>
                                            <p>{survey.stat}</p>
                                            <span>
                                            <img src={stats} alt="" id="survey-stats"/>
                                             <p>{survey.statNum}</p>
                                             </span>
                                        </div>
                                    </div>
                                 </div>
                            ))}
                        </div>
                        <div className="arrows-carousol">
                            <img src={arrow} alt="" id="arrow-c1" onClick={() => moveCarousel('forward')}/>
                            <img src={arrow} alt="" id="arrow-c2" onClick={() => moveCarousel('backward')}/> 
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Surveys