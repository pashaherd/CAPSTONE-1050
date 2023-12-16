import React from 'react'; 
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'; 
import info from '../assets/info.png'
import arrow from '../assets/arrow.png'
import stats from '../assets/bar-chart.png'; 

const Surveys = ({loadData ,loadDataReady, isLoggedIn}) =>{
const [surveysInProgress, setSurveysInProgress] = useState(loadData?.incompletedSurveys ?? []); 
const navigate = useNavigate(); 
const [surveys, setSurveys] = useState( loadData?.allInactiveSurveys ?? [])
const [surveyCarousel, setSurveyCarousel] = useState(new Array(surveys.length).fill('off'))

useEffect(() => {
     let carousel = [...surveyCarousel]; 
     let j = carousel.length - 1; 
     
     carousel[j] = 'prev'; 
     carousel[0] = 'current'; 
     carousel[1] = 'next'; 

     setSurveyCarousel(carousel)
     console.log(surveys); 
     console.log('the')
},[surveys])

useEffect(() =>{
    const j = loadData?.allInactiveSurveys ? loadData.allInactiveSurveys.length : 0; 
        setSurveyCarousel(new Array(j).fill('off')) 

        console.log(j); 
        console.log(loadData); 
        setSurveys(loadData?.allInactiveSurveys ?? []); 
        setSurveysInProgress(loadData?.incompletedSurveys ?? []);
},[loadData])

useEffect(() =>{
  console.log(surveyCarousel); 
  console.log('up')
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

    /// Handle Survey Start 
    function handleSurveyStart(e){
        let target = e.target
        
        while(!target.className.match(/^cc/)){
            target = target.parentNode; 
        }

        const id = parseInt(target.id); 
        navigate(`/survey/${surveys[id]["survey_ref"]}`)
    }

    function handleMiniSurveyStart(e){
        let target = e.target; 
        while(target.className !== 'mini-s'){
            target = target.parentNode
        }

        let id = parseInt(target.id); 
        navigate(`/surveys/${surveys[id]["survey_ref"]}`); 
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
                  {surveysInProgress.length ? surveysInProgress.map((survey,i) =>(
                    <div className="incompleted-survey" key={i}>
                        <div className="header-incompleted">
                            <h3>{survey.survey_title}</h3>
                             <div className="progress-bar">
                                <p>{`${survey.status}%`}</p>
                                <div className="meter-cover">
                                    <div className="meter" style={{background:`linear-gradient(90deg,rgba(0,255,0,0.5) ${survey.status}%, white 0% )`}}></div>
                                </div>
                             </div>
                        </div>
                        <div className="btn-incompleted"><button>Continue</button></div>
                    </div>
                    )) : <div className="surveys-incompleted-clear"><h1>All Clear Here 🥳</h1></div>}
                  </div>
                </div>
                <div className="survey-carousol-body">
                    <h1>Start New</h1>
                    <div className="carousol-body">
                        <div className="carousol-cards">
                            { surveys.length ? surveys.length < 3 ?<div className="minimal-surveys">
                            <div className='mini-s' id="0">
                                    <span className="survey-card-header">
                                        <h2>{surveys[0]?.survey_title ?? 'null'}</h2>
                                        <p>{surveys[0]?.survey_desc ?? 'null'}</p>
                                    </span>
                                    <div className="survey-start-btn"><button onClick={(e) => handleSurveyStart(e)}>Start</button></div>
                                    <div className="new-survey-stats">
                                        <div>
                                            <p>Completion Count</p>
                                            <span>
                                            <img src={stats} alt="" id="survey-stats"/>
                                             <p>{surveys[0]?.survey_avg_completion ?? 0}</p>
                                             </span>
                                        </div>
                                    </div>
                                 </div>
                                 <div className='mini-s' id="1">
                                    <span className="survey-card-header">
                                        <h2>{surveys[1]?.survey_title ?? 'null'}</h2>
                                        <p>{surveys[1]?.survey_desc ?? 'null'}</p>
                                    </span>
                                    <div className="survey-start-btn"><button onClick={(e) => handleSurveyStart(e)}>Start</button></div>
                                    <div className="new-survey-stats">
                                        <div>
                                            <p>Completion Count</p>
                                            <span>
                                            <img src={stats} alt="" id="survey-stats"/>
                                             <p>{surveys[1]?.survey_avg_completion ?? 0}</p>
                                             </span>
                                        </div>
                                    </div>
                                 </div>
                            </div> : surveys.map((survey,i) =>(
                                 <div className={`cc ${surveyCarousel[i]}`} key={i} id={`${i}`}>
                                    <span className="survey-card-header">
                                        <h2>{survey?.survey_title ?? 'null'}</h2>
                                        <p>{survey?.survey_desc ?? 'null'}</p>
                                    </span>
                                    <div className="survey-start-btn"><button onClick={(e) => handleSurveyStart(e)}>Start</button></div>
                                    <div className="new-survey-stats">
                                        <div>
                                            <p>Completion Count</p>
                                            <span>
                                            <img src={stats} alt="" id="survey-stats"/>
                                             <p>{survey.survey_avg_completion || 0}</p>
                                             </span>
                                        </div>
                                    </div>
                                 </div>
                            )) : <div className="surveys-incompleted-clear"><h1>All Clear Here 🥳</h1></div>}
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