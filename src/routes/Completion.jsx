import React from 'react'
import {useState,useEffect} from 'react'; 
import {useParams} from 'react-router-dom'; 
import {toast, ToastContainer} from 'react-toastify'; 
import smiling from '../assets/smiling.png'; 
import neutral from '../assets/neutral.png'; 
import angry from '../assets/angry.png'; 
import sad from '../assets/sad.png'; 



export default function Completion(){
    const [isDataReady, setDataReady] = useState(false);
    const [data,setData] = useState({});  
    const [questions, setQuestions] = useState([]); 
    const [collectData, setCollectData] = useState({
        surveyRef:"",
        answers:[],
        comment:'',
        rating:'',
    }); 

    const { id } = useParams(); 

    useEffect(() =>{
        console.log(id); 
       async function getSurveyData(){
         const token = localStorage.getItem('token'); 

         try{
          const req = await fetch(`/survey/${id}`, {method:"GET", headers:{'Authorization':`Bearer ${token}`}});
          const res = await req.json(); 

          if(res.not){
            throw new Error(res.msg); 
          }
          console.log(res); 
          setData(res);
          const ques = JSON.parse(res[0].survey_instructions)
          console.log(ques); 
          setQuestions(ques); 
          setDataReady(true); 
         }catch(e){
           toast.error(e.message, {position:'top-center', autoClose:3000})
         }
       }
      getSurveyData();
    },[]); 
    
    useEffect(() =>{
        console.log(collectData); 
    },[collectData])
    function handleDataCollection(e){
        const name = e.target.name; 
        const value = e.target.value; 
        const surveyRef = id;

        if(e.target.id === 'question'){
            const question = e.target.previousSibling.innerHTML; 
           setCollectData((prev) => {
             prev["answers"] = [...prev["answers"],{question,answer:value}];
             prev["surveyRef"] = surveyRef;
             return prev
           })

        } 
        else {
            setCollectData((prev) =>({
                ...prev, 
                [name]:value
            }))
        }
    }

    // Submit 

    async function handleCompletionSubmit(){
        const token = localStorage.getItem('token'); 
        const progress = collectData["answers"].length; 
        const total = questions.length; 
        const author = localStorage.getItem('id'); 

        const surveyStatus = (total / progress)
        try{
         const req = await fetch('/survey/submit', {
            method:'POST', 
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({...collectData, surveyStatus, user_id:author})
         })
         const res = await req.json(); 

         if(!res.ok){
            throw new Error(res.msg)
         }

         toast.success(res.msg, {position:'top-center', autoClose:3000}); 
         setTimeout(() =>{
         window.location = '/'
         },3000)  
        }catch(e){
            toast.error(e.message, {position:'top-center', autoClose:3000})
        }
    }
    return (
        <>
        {
        !isDataReady ? <div className="loader-wrap-cp">
            <div className="loader-cp">
                <h1>Loading</h1>
                <span className="loader"></span>
            </div>
        </div>:
        <>
        <div className="completion-page-wrap">
              <div className="completion-page">
                <div className="completion-header">
                    <h1>{data[0].survey_title}</h1>
                    <span>
                    <p>{data[0].survey_desc}</p>
                    <p>{data[0].survey_author}</p>
                   </span>
                </div>
                <div className="completion-questions">
                    {questions.map((ques, i) =>(
                        <div className="segment-cp" key={i}>
                            <h3>{ques?.question ? ques.question : ques.questionLTQ}</h3>
                            <div className="answer-cp">
                                <span>
                                    {ques.type === 'Multiple Choice' && <p>{ques.answer1}</p>}
                                    {ques.type === 'Likert' && <p>Disagree</p>}
                                    {ques.type === 'Meter' && <p>1</p>}
                                    <input type="radio" name={`answer${i}`} value="1" id="question" onClick={(e) => handleDataCollection(e)}/> 
                                </span>
                                <span>
                                {ques.type === 'Multiple Choice' && <p>{ques.answer2}</p>}
                                    {ques.type === 'Likert' && <p>Somewhat Disagree</p>}
                                    {ques.type === 'Meter' && <p>2</p>}
                                    <input type="radio" name={`answer${i}`} value="2" id="question" onClick={(e) => handleDataCollection(e)}/> 
                                </span>
                                <span>
                                {ques.type === 'Multiple Choice' && <p>{ques.answer3}</p>}
                                    {ques.type === 'Likert' && <p>Neutral</p>}
                                    {ques.type === 'Meter' && <p>3</p>}
                                    <input type="radio" name={`answer${i}`} value="3" id="question" onClick={(e) => handleDataCollection(e)}/> 
                                </span>
                                <span>
                                {ques.type === 'Multiple Choice' && <p>{ques.answer4}</p>}
                                    {ques.type === 'Likert' && <p>Somewhat Agree</p>}
                                    {ques.type === 'Meter' && <p>4</p>}
                                    <input type="radio" name={`answer${i}`} value="4" id="question" onClick={(e) => handleDataCollection(e)}/> 
                                </span>
                                {(ques.type === 'Likert' || ques.type === 'Meter') && 
                                ques.type === 'Likert' ? 
                                <span>
                                <p>Agree</p>
                                <input type="radio" name={`answer${i}`} value="5" id="question" onClick={(e) => handleDataCollection(e)}/> 
                                </span>: <span>
                                <p>5</p>
                                <input type="radio" name={`answer${i}`} value="5" id="question" onClick={(e) => handleDataCollection(e)}/> 
                                </span>}
                            </div>
                        </div>
                    ))}
                </div>
              <div className="comment-section">
                <span>
                <h2>Add Comment</h2>
                <input type="text" placeholder="Comment" id="comment-input" name="comment" onChange={(e) => handleDataCollection(e)}/> 
                </span>
                <div className="divide-cp"></div>
                <div className="rating-cp">
                   <span>
                    <img src={smiling} alt="" className="rating-icon-cp"/>
                    <input type="radio" name="rating" value="4" onClick={(e) => handleDataCollection(e)}/>
                   </span>
                   <span>
                    <img src={neutral} alt="" className="rating-icon-cp"/>
                    <input type="radio" name="rating" value="3" onClick={(e) => handleDataCollection(e)}/>
                   </span>
                   <span>
                    <img src={sad} alt="" className="rating-icon-cp"/>
                    <input type="radio" name="rating" value="2" onClick={(e) => handleDataCollection(e)}/>
                   </span>
                   <span>
                    <img src={angry} alt="" className="rating-icon-cp"/>
                    <input type="radio" name="rating" value="1" onClick={(e) => handleDataCollection(e)}/>
                   </span>
                </div>
              </div>
            </div>
            <div className="completion-submit"><button onClick={() => handleCompletionSubmit()}>Complete</button></div>
        </div>
        </>
        }
        <ToastContainer/> 
        </>
    )
}
