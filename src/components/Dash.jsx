import React from 'react'; 
import {useEffect, useState, useRef} from 'react'; 
import { Line, Pie, Bar } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto' 
import { useInView } from 'react-intersection-observer'
import completed from '../assets/completed-task.png'
import target from '../assets/target-a.png'
import name from '../assets/management.png'; 
import group from '../assets/group-chat.png';
import search from '../assets/search.png'; 
import x from '../assets/close.png'; 
import checkbox from '../assets/checkbox.png'; 
import redx from '../assets/redx.png'; 


const Dash = ({data,handlePromotion,handleDemotion,handleTeamCreation,handleSurveyTemplateSubmit,handleSurveyBuildSubmit,handleSubmitPost, handleNotificationData, handleGoalSubmit, handleSearch, handleCampaignDataSubmit}) =>{
    const [grid, setGrid] = useState(new Array(100).fill(null));
    const [secondSlide, setSecondSlide] = useState(false); 

    // News Post
    const [newsData, setNewsData] = useState({}); 
    const [captionCharacterCount, setCaptionCharacterCount] = useState(0);
    const [contentCharacterCount, setContentCharacterCount] = useState(0);
    const [notificationFields, setNotificationFields] = useState({
        type:'',
        notification:''
    }) 
    const [notificationCharacterCount, setNotificationCharacterCount] = useState(0); 
    
    // Team & Personal Graph Stats
    const [personalContributions, setPersonalContributions] = useState(
        { data:{
            labels: ['January', 'February', 'March', 'April', 'May','June','July','August','September','October','November', 'December'],
            datasets: [
              {
                label: 'Feedback Contributions',
                data:(data?.calculatedGraph ?? [0,0,0,0,0,0,0,0,0,0,0,0]),
                fill: true, // To create a line chart without filling the area under the line
                backgroundColor:'rgba(127, 255, 212, 0.242)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
              },
            ],
          }
        ,
        options:{
            scales: {
                y: {
                  title:{
                      display:true,
                      text:'# Of Contributions'
                  },
                  beginAtZero: true,
                },
                x:{
                  title:{
                      display:true, 
                      text:'Timeline'
                  }
              }
              }
        
        }
    }
    ); 
    const [teamContributions, setTeamContributions] = useState({
         data:{
            labels: ['January', 'February', 'March', 'April', 'May','June','July','August','September','October', 'November', 'December'],
            datasets: [
              {
                label: 'Feedback Contributions',
                data: (data?.calculatedTeamGraph ?? [0,0,0,0,0,0,0,0,0,0,0,0]),
                fill: true, // To create a line chart without filling the area under the line
                backgroundColor:'rgba(127, 255, 212, 0.242)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
              },
            ],
          }
        ,
        options:{
            scales: {
                y: {
                  title:{
                      display:true,
                      text:'# Of Contributions'
                  },
                  beginAtZero: true,
                },
                x:{
                  title:{
                      display:true, 
                      text:'Timeline'
                  }
              }
              }
        
        }
    
    }); 
    const [totalTeamEffort, setTotalTeamEffort] = useState({})
    
    const [teamEffort, setTeamEffort] = useState({
        data:{
            labels:['Team1', 'Team2', 'Team3','Team4'],
            datasets:[
                {
                    label:'In Comparison To Other Teams',
                    data: (data?.allTeamEfforts ?? []),
                    backgroundColor:'rgba(127, 255, 212, 0.5)',
                    borderColor:'rgba(127,255,212,0.75)',
                    borderWidth:1 
                }
            ]
        },
        options:{
            scales:{
                y:{
                    beginAtZero:true
                }
            }
        }
    })
    
    // Goal Section 
    const [personalGoals, setPersonalGoals] = useState(data?.sortedGoals[0] ?? []); 
    const [teamGoals, setTeamGoals] = useState(data?.sortedGoals[1] ?? []); 
    const [ptGoalCount, setPtGoalCount] = useState(0); 
    const [ptGoalData, setPtGoalData] = useState({}); 
    const [assignedGoals, setAssignedGoals] = useState(data?.sortedGoals[2] ?? []); 
    const [isSecondGoalSlide, setGoalSlide] = useState(false); 
    const [isAssign, setAssign] = useState(false); 
    const [isTeamGoal, setTeamGoal] = useState(false); 
    const [assignedGoalData, setAssignedGoalData] = useState({}); 
    const [assignedGoalCharacterCount, setAssignedGoalCharacterCount] = useState(0); 
    // Create Survey
    
    const [isSurveyFirstSlide, setSurveyFirstSlide] = useState(true); 
    const [isCampaign, setCampaign] = useState(false); 
    const [surveyTitleCount, setSurveyTitleCount] = useState(0); 
    const [surveyDescCount, setSurveyDescCount] = useState(0); 
    const [campaignData, setCampaignData] = useState({})
    const [isSecondCampaignSlide, setSecondCampaignSlide] = useState(false); 
    const [surveySearchResults, setSurveyResults] = useState([]);
    const [resultPool, setResultPool] = useState([]); 
    const [surveySlideState, setSurveySlideState] = useState('create-survey'); 
    const [thirdSlideSearchResults, setThirdSlideSearchResults] = useState([]); 
    const [thirdSlideStyles, setThirdSlideStyles ] = useState({}); 
    const [isThirdCampaignSlide, setThirdCampaignSlide] = useState(false); 
    const [selectedCandidates, setSelectedCandidates] = useState([{name:'Result'}]); 

    // Create Survey 
    const [surveyBuilderSelections, setBuilderSelections] = useState([{type:'Likert',color:'0,255,0'},{type:'Multiple Choice', color:'0,0,255'},{type:'Meter', color:'255,0,0'}])
    const [isThirdSurveySlide, setThirdSurveySlide] = useState(false); 
    const [isSecondSurveySlide, setSecondSurveySlide] = useState(false); 
    const [saveTemplate, setSaveTemplate] = useState(false); 
    const [thirdSlideData, setThirdSlideData] = useState({}); 
    const [surveyTitleCount2, setSurveyTitleCount2] = useState(0); 
    const [surveyDescCount2, setSurveyDescCount2] = useState(0);
    const [builderQuesitionCount, setBuilderQuestionCount] = useState(new Array(surveyBuilderSelections.length).fill(0)); 
    const [builderAnswerCount, setBuilderAnswerCounts] = useState(new Array(surveyBuilderSelections.length).fill(new Array(4).fill(0))); 
    const [isBuildSet, setBuildSet] = useState(new Array(surveyBuilderSelections.length).fill(false)); 
    const [surveyBuilderData, setBuilderData] = useState(new Array(surveyBuilderSelections.length).fill({
        question:'',
        answer1:'',
        answer2:'',
        answer3:'',
        answer4:''
    }));  
    
    // Templates
    const [savedTemplates, setSavedTemplates] = useState(data?.templates ?? []); 
    const [currentTemplate, setCurrentTemplate] = useState({}); 
    const [templateCount, setTemplateCount] = useState(0);
    const [isTemplateSlide, setTemplateSlide] = useState(false); 
 
     useEffect(() =>{
       console.log(savedTemplates); 
     },[savedTemplates])
 
    const [loadedTemplateQuestions, setLoadedTemplateQuestions] = useState([]); 
    const [templateData, setTemplateData ] = useState(new Array(loadedTemplateQuestions.length + 1).fill({}))
    const [multipleChoiceData, setMultipleChoiceData] = useState(new Array(loadedTemplateQuestions.length).fill({}))
    const [templateQuestionCounts, setTemplateQuestionCounts] = useState(new Array(loadedTemplateQuestions.length).fill(0)); 
    const [multipleChoiceQuesitonCounts, setMultipleChoiceQuestionCounts] = useState(new Array(loadedTemplateQuestions.length).fill(new Array(4).fill(0)))
    const [publishSettingsCount, setPublishSettingsCount] = useState([0,0,0])
   
   
   // Admin Stuff 
   const [campaignReports, setCampaignReports] = useState([]); 
   const [memberPool, setMemberPool] = useState([]); 
   const [memberPoolSelections, setMemberPoolSelections] = useState([]); 
   const [isPermissions, setPermissions] = useState(true); 
   const [permissionsPool, setPermissionsPool] = useState([]); 
   const [teamName, setTeamName] = useState({
    teamName:''
   })

    const [ref, inView] = useInView(); 
    const graph = useRef(); 
    const toggleDiv = useRef(); 
    const goalsDiv = useRef(); 
   
    
    useEffect(() =>{
        const h1 = document.querySelector('.dash-a h1'); 
        if(inView){
            h1.classList.add('view'); 
        } else {
            h1.classList.remove('view'); 
        }
    },[inView])

    function handleGhostMode(){
        const ghostDiv = document.querySelector('.ghost-toggle'); 
        const ghostButton = document.querySelector('.ghost-toggle div'); 
        
        ghostDiv.classList.toggle('on'); 
        ghostButton.classList.toggle('on'); 
        
      }
      
   useEffect(() =>{
            console.log(data); 
         },[])
    // Toggle Notification Types

    useEffect(() =>{
      const div = toggleDiv.current; 
      const children = Array.from(div.children); 

      children.forEach((child) =>{
        child.addEventListener('click', (e) =>{
            const id = e.target.id 

            if(e.target.tagName === 'DIV'){
            e.target.style.backgroundColor ='rgba(13, 165, 114,0.75)'
            }
            for(let i = 0; i < children.length; i++){
                if(children[i]["id"] !== id){
                    children[i]["style"]["backgroundColor"] = 'rgba(0,0,0,0)'
                }
            }
            
            const h2 = e.target.firstChild.innerHTML
            setNotificationFields((prev) => ({
                ...prev,
                type:h2
            }))
        })
      })

      const goals = Array.from(goalsDiv.current.children); 
      
      goals.forEach((goal) =>{
        goal.addEventListener('click', (e) =>{
            setGoalSlide(true); 
            
            if(e.target.className === 'assign-gt'){
                setAssign(true)
            } 
            if(e.target.id === 'pg-tg-2'){
                setTeamGoal(true)
            }
        })
      })

      const adminHeader = Array.from(document.querySelector('.admin-header').children); 
      adminHeader.forEach((btns) =>{
        btns.addEventListener('click', (e) =>{
            if(e.target.id === 'perm1'){
                e.target.classList.toggle('active',true);
                e.target.style.backgroundColor = 'var(--primary-base-shade3)'

                e.target.nextSibling.classList.toggle('active', false)
                e.target.nextSibling.style.backgroundColor = 'rgba(0,0,0,0)';

                setTimeout(() =>{
                    setPermissions(true)
                },500)
            } else if(e.target.id === 'perm2'){
               e.target.classList.toggle('active', true); 
               e.target.style.backgroundColor = 'var(--primary-base-shade3)'


               e.target.previousSibling.classList.toggle('active',false); 
               e.target.previousSibling.style.backgroundColor = 'rgba(0,0,0,0)';  
               setTimeout(() =>{
                 setPermissions(false); 
               },500)
            }
        })
      })
    
    },[]);
    
    
    useEffect(() =>{
       if(isSurveyFirstSlide){
            const surveyCovers = Array.from(document.querySelector('.create-survey').children);
      
            surveyCovers.forEach((cover) =>{
              cover.addEventListener('click', (e) =>{
                  const wrap = document.querySelector('.create-survey-wrap'); 
                  const cover = document.querySelector('.create-survey');
                  
                  if(wrap.lastChild.className === 'create-survey'){
                  const el = e.target.tagName === 'H2' ? e.target.parentNode : e.target
                  if(el.className === 'campaign-cover'){
                      setCampaign(true)
                  } else{
                      setCampaign(false); 
                  }
                   
                  cover.classList.toggle('cover',true); 
                  setTimeout(() =>{
                      setSurveyFirstSlide(false);
      
                      const path1 = document.querySelector('.campaign'); 
                      const path2 = document.querySelector('.survey-cs');
      
                      console.log('changed');
                      if(e.target.className === 'campaign-cover'){
                        setSurveySlideState('campaign')
                      path1.classList.toggle('go-back',false); 
                      } else {
                        setSurveySlideState('survey-cs')
                          path2.classList.toggle('go-back',false); 
                      }
                  },500) 
                }
              })
            })
          } 
    },[isSurveyFirstSlide])


    

    // Character Limit 

    function characterLimit(e,limit,index){
        const name = e.target.name; 
        const value = e.target.value; 
       
        if(value.length > limit){
         e.target.value = e.target.value.slice(0,limit + 1); 
      } else {
        if(name === "caption"){
           setCaptionCharacterCount((prev) => value.length)
        } else if(name === "content"){
         setContentCharacterCount((prev) => value.length)
        } else if(name === "notification"){
         setNotificationCharacterCount((prev) => value.length)
        } else if(name === 'assignedGoal'){
         setAssignedGoalCharacterCount((prev) => value.length); 
        } else if(name === 'ptGoal'){
         setPtGoalCount((prev) => value.length)
        } else if(name === 'title'){
            setSurveyTitleCount((prev) => value.length)
        } else if(name === 'desc'){
            setSurveyDescCount((prev) => value.length); 
        } else if(name === 'surveyTitle'){
            setSurveyTitleCount2((prev) => value.length)
        } else if(name === 'description'){
            setSurveyDescCount2((prev) => value.length); 
        } else if(name === 'template'){
            setTemplateCount((prev) => value.length); 
        } else if(name === 'question'){
            setBuilderQuestionCount((prev) => {
                let copy = [...prev]; 
                copy[index] = value.length; 
                return copy; 
            })
        
        } else if(name.match(/^ltq/)){
            setMultipleChoiceQuestionCounts((prev) =>{
                let copy = [...prev]; 
                let j = name.length - 1; 
                const id = parseInt(name[j]); 

                copy[index][id - 1] = value.length; 
                return copy
            })
        } else if(name.match(/^answer/)){
            setBuilderAnswerCounts((prev) =>{
                let copy = [...prev]; 
                let id = name.length - 1;
                let num =  name[id]; 
                 

                copy[index][num - 1] = value.length; 
                return copy
            })
        } else if(name === 'questionLTQ'){
             setTemplateQuestionCounts((prev) =>{
                let copy = [...prev]; 
                copy[index] = value.length; 
                return copy
             })
        } else if(name.match(/^survey/)){
            setPublishSettingsCount((prev) =>{
                let copy = [...prev]; 
                copy[index] = value.length;
                return copy            
            })
        }
     }
     }
        // News Story Additions 

        function slide(method){
            const firstDiv = document.querySelector('.first-slide-news'); 
            const secondDiv = document.querySelector('.second-slide-news');
          if(method === 'forward'){
            firstDiv.classList.add('slide');
            

            setTimeout(() =>{
              setSecondSlide(true)
              secondDiv.classList.remove('slide')
            },500)
          }

          if(method === 'reverse'){ 
            secondDiv.classList.add('slide'); 

            setTimeout(() =>{
              setSecondSlide(false);
              firstDiv.classList.remove('slide'); 
            },500)
          }
        }
        
        function handleNewsStoryData(e,limit){
             const name = e.target.name; 
             const value = e.target.value; 
             const author = data.employee.first_name + ' ' + data.employee.last_name

             characterLimit(e,limit); 

             setNewsData((prev) =>({
                ...prev,
                [name]:value,
                author
             }))
        }

        // Notifications 
    function handleNotificaitonField(e){
        const name = e.target.name;
        const value = e.target.value; 
        const author = data.employee.first_name + ' ' + data.employee.last_name;
 
        characterLimit(e,100);
        
        if(value.length <= 100){
        setNotificationFields((prev) =>({
            ...prev, 
            [name]:value,
            author
        }))
    }
     }
   // Revert Goal 

   function goalRevert(e){
       console.log(e.target); 

       setGoalSlide(false); 
       setAssign(false); 
       setTeamGoal(false); 
   }

   // Collect Goal Data
   useEffect(() =>{
     console.log(assignedGoalData); 
   },[assignedGoalData])

   function handleAssignGoal(e){
       const name = e.target.name;
       const value = e.target.value; 
       const author = data.employee.first_name + ' ' + data.employee.last_name; 
       const employeeId = data.employee.employee_id; 

       if(e.target.tagName.toLowerCase() === 'textarea'){
         characterLimit(e,75); 
       }
       
       if(e.target.id.match(/^side/)){
           const type = e.target.firstChild.innerHTML; 

           e.target.style.backgroundColor = 'rgba(13, 165, 114,1)'; 
           switch(e.target.id){
            case 'side1':
                e.target.nextSibling.style.backgroundColor = 'rgba(0,0,0,0)'
                break; 
            case 'side2':
                e.target.previousSibling.style.backgroundColor = 'rgba(0,0,0,0)'
                break; 
           }

           setAssignedGoalData((prev) =>({
            ...prev, 
            type:type
           }))
       }
        else if(value.length <= 75){
         setAssignedGoalData((prev) => ({
            ...prev, 
            [name]:value,
            author,
            employeeId
         }))
       }
   }

   function handlePTGoal(e){
      const name = e.target.name; 
      const value = e.target.value; 
      const author = isTeamGoal ? data.employee.team_id 
      : data.employee.first_name + ' ' + data.employee.last_name; 
      const id = data.employee.employee_id; 


      if(e.target.tagName.toLowerCase() === 'textarea'){
        characterLimit(e,75); 
      }

      if(value.length <= 75){
        setPtGoalData((prev) => ({
            ...prev, 
            [name]:value,
            author,
            id
        }))
      }
   }
   // Surveys

   useEffect(() =>{
     console.log(ptGoalData);
   },[ptGoalData])

   // Handle Go Back (Survey)

   function handleGoBack(state){
     let currentDiv; 
     const wrap = document.querySelector('.create-survey-wrap');
     console.log(state); 

     // Campaign /Survey First Layer
     if(state === 'campaign' || state === 'survey-cs'){
     if(wrap.lastChild.className === 'campaign'){
        currentDiv = document.querySelector('.campaign')
     } else {
        currentDiv = document.querySelector('.survey-cs')
     }
     currentDiv.classList.add('go-back'); 
     setTimeout(() =>{
       setSurveyFirstSlide(true); 

       // Restore Style
       const divs = Array.from(wrap.lastChild.children); 
       divs.forEach((div) =>{
         div.removeAttribute('style'); 
       })

       const cover = document.querySelector('.create-survey');  
       cover.classList.toggle('cover',false); 
       
     },500)
    }
     // Campaign Second Layer
     if(state === 'campaign slide'){
        const campaignDiv = document.querySelector('.campaign'); 
        const surveyCover = document.querySelector('.add-surveys-c');
        const survey = document.querySelector('.add-survey-cover');  
        
        setSecondCampaignSlide(false); 
        campaignDiv.firstChild.style.display = 'flex'; 
        surveyCover.style.backgroundColor = 'var(--primary-base)';
        campaignDiv.classList.remove('slide'); 
        campaignDiv.firstChild.classList.remove('slide'); 
        
        setSurveySlideState(campaignDiv.className); 
        
        return
     }

     // Campaign Third State 
     if(state === "finish-campaign-left"){
        const campaignDiv = document.querySelector('.campaign');  

        campaignDiv.classList.toggle('slide2',false); 

        setTimeout(() =>{
            setThirdCampaignSlide(false);
            setThirdSlideStyles({width:'100%', gridColumn:1,height:'90%', backgroundColor:'var(--primary-base)', display:'grid',placeItems:'center', alignSelf:'end'});  
            setSurveySlideState('campaign slide');
            
            const addSurveysWrap = document.querySelector('.add-surveys');
            addSurveysWrap.classList.toggle('slide2',false); 
          },500)
     }

     // Survey Second Slide 

     if(state === 'survey-second-slide'){
        const secondSlide = document.querySelector('.survey-second-slide'); 
        secondSlide.classList.toggle('slide', true); 

        setTimeout(() =>{
          setSecondSurveySlide(false); 
          setSurveySlideState('survey-cs');

          const firstSlide = document.querySelector('.survey-first-slide'); 
          firstSlide.classList.toggle('slide', false); 
        },500)
     }


     // Third Survey Slide 

     if(state === 'survey-third-slide'){
        const thirdSlide = document.querySelector('.survey-third-slide'); 
        thirdSlide.classList.toggle('slide', true); 

        setTimeout(() =>{
          setThirdSurveySlide(false); 
          setSurveySlideState('survey-second-slide'); 

          const secondSlide = document.querySelector('.survey-second-slide'); 
          secondSlide.classList.toggle('slide', false); 
        },500)
     }
   }

   function handleCampaignData(e,limit){
      const name = e.target.name; 
      const value = e.target.value; 

      characterLimit(e,limit)

      if(value.length <= limit){
        setCampaignData((prev) => ({
            ...prev,
            [name]:value
        }))
      }
   }
   
   useEffect(() =>{
     console.log(surveyBuilderData); 
   },[surveyBuilderData])


   function handleCampaignSlide(method){
       const campaign = document.querySelector('.campaign'); 
      const  wrap = document.querySelector('.add-surveys-c'); 
        const surveyCover = document.querySelector('.add-survey-cover'); 
        
        wrap.style.backgroundColor = 'rgba(0,0,0,0)'; 
        surveyCover.classList.add('slide'); 
       campaign.classList.add('slide');
       campaign.firstChild.classList.add('slide');
       
       setTimeout(() =>{
        campaign.firstChild.style.display = 'none'; 
        setSecondCampaignSlide(true); 
        setThirdSlideStyles({width:'100%', gridColumn:1,height:'90%', backgroundColor:'var(--primary-base)', display:'grid',placeItems:'center', alignSelf:'end'})
        setSurveySlideState(campaign.className); 

        const sc = document.querySelector('.sc-input-cover'); 
        sc.removeAttribute('style'); 
       },250)
   }

   // Add Selection 

   function addSurveySelection(e){
       let target = e.target; 

       while(target.className !== 'result-as'){
            target = target.parentNode; 
       }
       let id = parseInt(target.id.split('-')[1])
       const result = surveySearchResults[id]; 

       let newPool = [{name:result.survey_title}, ...resultPool]; 
       
       const isIncluded = resultPool.some((pod) => pod.name === result.survey_title); 
       
       if(!isIncluded){
       setResultPool(newPool);
       setCampaignData((prev) =>{
        if(prev.survey_pool){
            let copy = [...prev.survey_pool, {name:result.survey_title}];
            return {...campaignData, survey_pool:copy}
        } else {
            return {...campaignData,survey_pool:[{name:result.survey_title}]}
        }
       }) 
       }
   }

   // Remove Selection 

   function removeSurveySelection(e){
        const id = parseInt(e.target.id.split("-")[1])
       let copy = [...resultPool]; 

       copy = copy.filter((_,i) => i !== id)
       setResultPool(copy); 
   }

   // Third Campaign Slide 

   function handleCampaignThirdSlide(){
      const campaignDiv = document.querySelector('.campaign'); 
      const addSurveysWrap = document.querySelector('.add-surveys'); 

      
      campaignDiv.classList.toggle('slide2',true); 
      addSurveysWrap.classList.toggle('slide2', true); 

      
      setTimeout(() =>{
        setThirdCampaignSlide(true);
        setThirdSlideStyles({});  
        setSurveySlideState('finish-campaign-left'); 
      },500)
   }

   // Select Candidate TO Assign 

   function handleCandidateSelection(e,method){
      let target = e.target; 
      const id = parseInt(target.id.split('-')[1]); 

      while(target.className !== 'candidates-fc'){
        target = target.parentNode; 
      }
      if(method === 'add'){
         let name = target.firstChild.innerHTML; 
         target.style.backgroundColor = 'rgba(0,255,0,0.25)'; 
         
         setCampaignData((prev) => {
            if(prev.assigned_for){
                const copy = [...prev.assgined_for,{name}]
                return {...prev,assigned_for:copy}
            } else {
                return {...prev,assigned_for:[{name}]}
            }
         })
         setSelectedCandidates([{name}, ...selectedCandidates])
      } 

      if(method === 'remove'){
        target.style.backgroundColor = 'rgba(255,0,0,0.25)'; 
        let name = target.firstChild.innerHTML; 

        let copy = [...selectedCandidates];
        copy = copy.filter((_,i) => i !== id);

        setSelectedCandidates(copy); 

      }
   }

   // Handle Survey Creation Transition

   function surveyTransitionSlide(method){

    if(method === 'toSecond'){
     const firstSlide = document.querySelector('.survey-first-slide'); 
     
     firstSlide.classList.toggle('slide', true); 

     setTimeout(() =>{
        setSecondSurveySlide(true); 
        setSurveySlideState('survey-second-slide'); 


    const secondSlide = document.querySelector('.survey-second-slide');
        secondSlide.classList.toggle('slide', false)
     },500)
    } 

    if(method === 'toThird'){
        const secondSlide = document.querySelector('.survey-second-slide'); 
        secondSlide.classList.toggle('slide', true);

        setTimeout(() =>{
          setThirdSurveySlide(true); 
          setSurveySlideState('survey-third-slide'); 

          const third = document.querySelector('.survey-third-slide'); 
          third.classList.toggle('slide', false); 
        },500)
    }
     
   }

   // Third Slide Data  
   useEffect(() =>{
    console.log(thirdSlideData); 
  },[thirdSlideData])

   function handleThirdSlideData(e,limit,index){
    const name = e.target.name; 
    const value = e.target.value; 
    const author = data.employee.first_name + ' ' + data.employee.last_name;
    const _id = data.employee.employee_id; 

    let condition = name === 'surveyTitle' || name === 'description' || name === 'template'; 

    if(condition){
        characterLimit(e,limit); 
    }

     if(condition){
        if(value.length < limit){
           setThirdSlideData((prev) => ({
            ...prev,
            saveTemplate,
            author,
            empid:_id, 
            [name]:value
           }))
        }
     } else {
        setThirdSlideData((prev) => ({
            ...prev,
            saveTemplate,
            author,
            empid:_id, 
            [name]:value 
        }))
     }
    
   } 

   function handleEnableSaveTemplate(e){
    e.target.classList.toggle('on'); 
    e.target.parentNode.classList.toggle('on'); 
    
    setSaveTemplate(!saveTemplate)
   }
   // Handle Survey Components 

   function handleComponentAdd(e){
     const target = e.target.tagName === 'H3' ? e.target.parentNode : e.target; 

     let newAddition; 
     switch(target.id){
        case 'mc':
            newAddition = {type:'Multiple Choice', color:'0,0,255'}
        break; 
        case 'likert':
            newAddition = {type:'Likert', color:'0,255,0'}
        break; 
        case 'meter':
            newAddition = {type:'Meter', color:'255,0,0'}
        break; 
     }

     setBuilderSelections([...surveyBuilderSelections, newAddition])
     setBuilderAnswerCounts([...builderAnswerCount,[0,0,0,0]])
   }

   function handleComponentRemoval(e){
      let target = e.target; 
      while(target.className !== 'emulate'){
        target = target.parentNode
      }

      const id = parseInt(target.id.split('-')[1]);

                             
      const updatedSurveys = [...surveyBuilderSelections].filter((_,i) => i !== id)
      const updatedData = [...surveyBuilderData].filter((_,i) => i !== id); 

      setBuilderData(updatedData); 
      setBuilderSelections(updatedSurveys);   
   }

   function handleComponentSet(e, method){
    let target = e.target; 
    while(target.className !== 'emulate'){
       target = target.parentNode
    }
    const id = parseInt(target.id.split('-')[1]);
    let copy = [...isBuildSet]; 
    if(method === 'set'){
     copy[id] = true; 
    } else {
     copy[id] = false; 
    }
    setBuildSet(copy);
   }

   // Builder Data

   function handleBuilderData(e,limit,index){
      const name = e.target.name; 
      const value = e.target.value; 
      
      characterLimit(e,limit,index); 
      let target = e.target; 
      while(target.className !== 'emulate'){
        target = target.parentNode
      }
      const type = target.firstChild.children[1]["innerHTML"]; 
      
      if(value.length < limit){
        setBuilderData((prev) => {
            let copy = [...prev]; 
             copy[index] = {
                ...copy[index], 
                type,
                [name]:value
            } 
            return copy
            
        })
      }

   }

   // Templates
   useEffect(() => {
      console.log(multipleChoiceQuesitonCounts)
   },[multipleChoiceQuesitonCounts])

   function handleTemplateSlide(index){
      const firstSlideChildren = Array.from(document.querySelector('.templates').children); 
      
      firstSlideChildren.forEach((child) =>{
        child.classList.toggle('slide', true); 
      })
      setCurrentTemplate(savedTemplates[index])
     
      let templateBuild = savedTemplates[index]["template_build"]; 
      let parsed = JSON.parse(templateBuild); 
      console.log(templateBuild); 
      console.log(parsed); 
      setLoadedTemplateQuestions(parsed);
       
      setTemplateData(new Array(parsed.length + 1).fill({}))
      setMultipleChoiceData(new Array(parsed.length).fill({}));
      setTemplateQuestionCounts(new Array(parsed.length).fill(0)); 
      setMultipleChoiceQuestionCounts(new Array(parsed.length).fill(new Array(4).fill(0))) 
      setTimeout(() =>{
        setTemplateSlide(true); 

        const secondSlide = document.querySelector('.templates').firstChild; 
        secondSlide.classList.toggle('slide', false); 
      },300)

   }

   // Go Back
    function handleTemplateGoBack(){
        const currentSlide = document.querySelector('.loaded-temp-wrap'); 
        currentSlide.classList.toggle('slide', true); 

        setTimeout(() =>{
            setTemplateSlide(false); 

            const temp = document.querySelector('.templates'); 
            temp.classList.toggle('slide', false); 
        })
    }

    // Handle Template Data

    function handleTemplateData(e,limit,index, isFinish){
        const name = e.target.name; 
        const value = e.target.value; 
        const author = data.employee.first_name + ' ' + data.employee.last_name
        
        let target = e.target; 
        if(!isFinish){
        while(target.className !== 'ltq'){
            target = target.parentNode
        }
    }
        const type = isFinish ? null :  target.firstChild.innerHTML; 

        characterLimit(e,limit,index); 
        
        if(name.match(/^survey/) && value.length < limit){
           setTemplateData((prev) =>{
            let copy = [...prev]; 
            let j = copy.length -1; 
            copy[j] = {
                ...copy[j],
                author,
                [name]:value
            }
            return copy; 
           })
        }
         else if(value.length < limit){
            setTemplateData((prev) =>{
                let copy = [...prev];
                copy[index] = {
                    ...copy[index],
                    [name]:value,
                    type
                }
                return copy
            })
        }
    }

    useEffect(() =>{
       console.log(templateData)
    },[templateData]) 
    
    useEffect(() =>{
        console.log(multipleChoiceData)
     },[multipleChoiceData])

    function handleMultipleChoiceData(e,limit,index){
        const name = e.target.name; 
        const value = e.target.value; 

        characterLimit(e,limit,index)

        if(value.length < limit){
            setMultipleChoiceData((prev) =>{
                let copy = [...prev]; 
                copy[index] = {
                    ...copy[index],
                    [name]:value,
                    index
                }
                return copy
            })
        }

    }

    // Admin 

    //Team Management 

    function handleAddTeamMember(e){
        let target = e.target; 
        while(!target.className || target.className !== 'result-mt'){
            target = target.parentNode
        }
        const id = parseInt(target.id.split('-')[1]); 
        const selection = memberPool[id]
        const {first_name, employee_id} = selection; 
        
        const isIncluded = memberPoolSelections.some((sel) => first_name === sel.first_name);
        
        if(!isIncluded){
        setMemberPoolSelections([...memberPoolSelections,{first_name, employee_id}]); 
        }
    }

    function handleRemoveTeamMember(e){
        const selection = e.target.previousSibling.innerHTML; 

        const findSelectionIndex = memberPoolSelections.findIndex((mem) => mem.first_name === selection); 
         
        let temp = [...memberPoolSelections].filter((_,i) => i !== findSelectionIndex); 
        setMemberPoolSelections(temp); 
    }

    function handleTeamCreationData(e){
        const name = e.target.name; 
        const value = e.target.value; 

        setTeamName((prev) =>({
            ...prev,
            [name]:value
        }))
    }
    return(
        <div className="dashboard-wrap">
            <div className="dash-a">
                <div className="ghost-mode">
                    <h2>Ghost Mode 👻</h2>
                    <div className="ghost-toggle"><div onClick={() => handleGhostMode()}></div></div>
                </div>
                <h1 ref={ref}>{`Welcome ${data.employee.first_name}`}</h1>
            </div>
            <div className="analytics">
            <div className="static">
            <div className="numeric-s">
            <div>
                <img src={completed} alt="" className="analytic-icon"/>
                <span>
                    <p>Completed Surveys</p>
                    <h3>{data.employee.total_completed_surveys ? data.employee.total_completed_surveys : 0}</h3>
                </span>
            </div>
            <div>
                <img src={target} alt="" className="analytic-icon"/>
                <span>
                    <p>Assigned Target</p>
                    <h3>{data.employee.assignedTarget ? data.employee.assignedTarget : 0}</h3>
                </span>
            </div>
            </div>
            <div className="goals" ref={goalsDiv}>
                <div className="personal-g">
                    <h3>Personal Goals</h3>
                    <div className="pg-wrap">
                          {personalGoals.length ? personalGoals.map(({goal},i) =>(
                            <p key={i}>{goal}</p>
                          )) : <p>All Clear🎉</p>}
                    </div>
                </div>
                <div className="team-g">
                    <h3>Team Goals</h3>
                    <div className="tg-wrap">
                    {teamGoals.length ? teamGoals.map(({goal},i) =>(
                            <p key={i}>{goal}</p>
                          )) : <p>All Clear🎉</p>} 
                    </div>
                </div>
                <div className="assigned-g">
                    <h3>Assigned Goals</h3>
                    <div className="ag-wrap">
                    {assignedGoals.length ? assignedGoals.map(({goal},i) =>(
                            <p key={i}>{goal}</p>
                          )) : <p>All Clear🎉</p>} 
                    </div>
                </div>
            </div>
            </div>
            <div className="personal">
                <div className="stat-chart-wrap">
                    <h1>Contributions</h1>
                    <Line data={personalContributions.data} options={personalContributions.options}/> 
                </div>
                <div className="pie-chart-wrap">
                    <div className="pie-header">
                          <div><h2>Contribution Rates</h2></div>
                    </div>
                    <div className="pie-charts">
                        <span>
                        <p>Current Rate (per Month)</p>
                        <h2>{data.calculatedRates.currentRate}</h2>
                        </span>
                        <span>
                        <p>Previous Rate (per Month)</p>
                        <h2>{data.calculatedRates.lastRate}</h2>
                        </span>
                    </div>
                </div>
            </div>
            <div className="team">
                <div className="team-header">
                    <h2>My Team</h2>
                </div>
                <div className="team-stats">
                    <div className="static-team">
                        <span>
                            <img src={name} alt="" className="team-icon"/>
                            <h2>{data.team?.team_name ?? 'None'}</h2>
                        </span>
                        <span>
                            <img src={group} alt="" className="team-icon"/>
                            <h2>{`Member Count: ${data.team?.team_member_count ?? 0}`}</h2>
                        </span>
                    </div>
                    <div className="dynamic-team">
                        <div>
                           <h2>Team Contributions</h2>
                           <Line data={teamContributions.data} options={personalContributions.options}/>
                        </div>
                        <div>
                            <h2>Total Effort</h2>
                            <Bar data={teamEffort.data} options={teamEffort.options}/> 
                        </div>
                    </div>
                </div>
            </div>
         </div> 
         <div className="news-dash">
                {secondSlide ? <div className="second-slide-news">
                    <span id="second-slide-header">
                    <button onClick={() => slide('reverse')}>Back</button>
                    <h3>Follow The Prompts To Create A News Update</h3>
                    </span>
                    <div className="inputs-ss">
                          <div className="input-caption">
                            <label>Set Caption</label>
                            <textarea placeholder="Enter" id="caption-news-input" name="caption" onChange={(e) => handleNewsStoryData(e,22)}></textarea>
                            <p>{`${captionCharacterCount}/22`}</p>
                          </div>
                          <div className='input-content'>
                            <label>Set Content</label>
                            <textarea name="content" id="content-news" placeholder="Update Your Organization. Make A Concise & Informative Post About Current Events"
                            onChange={(e) => handleNewsStoryData(e,120)}></textarea>
                            <p>{`${contentCharacterCount}/120`}</p>
                          </div>
                    </div>
                    <div className="second-slide-btn"><button onClick={() => handleSubmitPost(newsData)}>Submit Post</button></div>
                </div> :
                <div className="first-slide-news">
                <h1>Create A News Story</h1>
                    <div className="bg-news">
                        <div className="pseudo-line" id="line1"></div>
                        <div className="pseudo-line" id="line2"></div>
                        <div className="pseudo-card"></div>
                    </div>
        <div className="enter-btn-news"><button onClick={() => slide('forward')}>Enter</button></div>
    </div>
    }
                    </div>
        <div className="notification-center">
            <h1>Create Notification</h1>
            <div className="notification-wrap">
                 <div className="toggle-noti" ref={toggleDiv}>
                    <div id="t1">
                        <h2>Public</h2>
                    </div>
                    <div id="t2">
                        <h2>Team</h2>
                    </div>
                    <div id="t3">
                        <h2>Personal</h2>
                    </div>
                 </div>
                 <div className="input-noti-wrap">
                     <div className="input-noti">
                     <span>
                        <p>Set Notification</p>
                        <input type="text" placeholder="Enter" id="notification-input" name="notification" value={notificationFields.notification}
                        onChange={(e) => handleNotificaitonField(e)} />
                     </span>
                     <p id="input-count">{`${notificationCharacterCount}/100`}</p>
                     </div>
                     <div className="button-noti"><button onClick={() => handleNotificationData(notificationFields)}>Send</button></div>
                 </div>
            </div>
        </div>
        <div className="goal-setting-wrap">
            <h1>Set Goals</h1>
            <div className="goal-setting">
                {isSecondGoalSlide ? isAssign ? <div className='assign-goal'>
                    <div className="assign-goal-header">
                    <button onClick={(e) => goalRevert(e)}>Back</button>
                    <h2>Follow Prompts To Assign Goal 📝</h2>
                    </div>
                    <div className="ag-goal">
                        <div className="inputs-ag">
                            <span>
                                <label>Team Name, or Employee ID</label>
                                <input type="text" placeholder="Enter" id="name-input-ag" name="id" value={assignedGoalData.id} 
                                onChange={(e) => handleAssignGoal(e)}/> 
                            </span>
                            <div className="inputs-ag-pill">
                                <div id="side1" onClick={(e) => handleAssignGoal(e)}>
                                   <p>Employee</p>
                                </div>
                                <div id="side2" onClick={(e) => handleAssignGoal(e)}>
                                   <p>Team</p>
                                </div>
                            </div>
                            <div className="goal-ag">
                                <label>Specify Goal</label>
                                <span id="specify-goal">
                                <textarea placeholder="Assign Goal Here" name="assignedGoal" value={assignedGoalData.assignedGoal} 
                                onChange={(e) => handleAssignGoal(e)}></textarea> 
                                <p>{`${assignedGoalCharacterCount}/75`}</p>
                                </span>
                            </div>
                        </div>
                        <div className="submit-ag"><button onClick={() => handleGoalSubmit('/goal/assign',assignedGoalData)}>Assign</button></div>
                    </div>
                </div> : <div className="regular-goal">
                    <div className="reg-goal-header">
                    <button onClick={(e) => goalRevert(e)}>Back</button>
                    <h2>{isTeamGoal ? 'Set Team Goal' : 'Set Personal Goal'}</h2>
                    </div>
                    <div className="inputs-wrap-rg">
                    {isTeamGoal && <div className="team-name-rg">
                        <label>Specify Team Name</label>
                        <input type="text" placeholder="Enter" id="team-name" name="team" value={ptGoalData.team} 
                        onChange={(e) => handlePTGoal(e)}/> 
                        </div>}
                    <div className="set-goal-rg">
                        <label>Specify Goal</label>
                        <span id="specify-reg-goal">
                        <textarea placeholder="Enter" id="set-goal" name="ptGoal" value={ptGoalData.ptGoal}
                        onChange={(e) => handlePTGoal(e)}></textarea> 
                        <p>{`${ptGoalCount}/75`}</p>
                        </span>
                    </div>
                    <div className="button-submit-rg"><button onClick={() => handleGoalSubmit('/goal',ptGoalData)}>Submit</button></div>
                    </div>
                </div> :
                <div className="goal-type" ref={goalsDiv}>
                    <div className="assign-gt">
                        <h2>
                           📝 Assign Goal
                        </h2>
                    </div>
                    <div className="pg-tg-wrap">
                    <div id="pg-tg-1">
                        <h2>
                            📌Personal Goal
                        </h2>
                    </div>
                    <div id="pg-tg-2">
                        <h2>
                            🪜Team Goal
                        </h2>
                    </div>
                    </div>
                </div>
}
            </div>
        </div>
        <div className="create-survey-wrap">
            <span className="create-survey-header">
            <button onClick={() => handleGoBack(surveySlideState)}>Back</button>
            <h1>Surveys & Campaigns </h1>
            </span>
            {isSurveyFirstSlide ? 
            <div className="create-survey">
                <div className="campaign-cover">
                     <h2>Launch Campaign 🚀</h2>
                </div>
                <div className="survey-cover-cs">
                    <h2>Create Survey 📜</h2>
                </div>

            </div> :
            isCampaign ? <div className="campaign">
                {!isSecondCampaignSlide? 
                <div className="campaign-inputs">
                    <span id="input1-c">
                        <label>Campaign Title</label>
                        <span>
                        <input type="text" placeholder="Enter" name="title" className="title-c" 
                        value={campaignData.title} onChange={(e) => handleCampaignData(e,22)}/>
                        <p>{`${surveyTitleCount}/22`}</p>
                       </span>
                    </span>
                    <span id="input2-c">
                        <label>Campaign Description</label>
                        <span>
                        <textarea placeholder="Write A Description" name="desc" className="title-c"
                        value={campaignData.desc} onChange={(e) => handleCampaignData(e,50)}></textarea>
                        <p>{`${surveyDescCount}/50`}</p>
                        </span>
                    </span>
                    <span id="input3-c">
                        <label>Reference ID</label>
                        <input type="text" placeholder="Enter" name="ref" className="title-c" value={campaignData.ref} 
                        onChange={(e) => handleCampaignData(e,1000)}/>
                    </span>
                    <div className='feedback-c'>
                       <label>Set Feedback Cycle</label>
                       <select name="cycle" >
                         <option>Every Day</option>
                         <option>Every Week</option>
                         <option>Bi Weekly</option>
                         <option>Every Month</option>
                       </select>
                    </div>
                    <div className="set-btn-c"><button onClick={() => handleCampaignSlide('forward')}>Set</button></div>
                </div> : <div className="sc-input-cover" 
                style={thirdSlideStyles}>
                    {!isThirdCampaignSlide ?
                    <h2>Set ✅</h2>
                    : <div className="finish-campaign-left" style={{}}>
                      <h2>Assign & Finish</h2>
                      <div className='assign-fc'>
                        <span className="assign-fc-header">
                        <label>Find Team or Employee</label>
                        <input type="text" placeholder="Search" id="search-fc" name="search" onClick={(e) => handleSearch(e,'/campaign/search/employee',setThirdSlideSearchResults,thirdSlideSearchResults)}/>
                        </span>    
                        <div className="results-fc">
                            {thirdSlideSearchResults.map((result,i) =>(
                                  <div className="candidates-fc"key={i}>
                                     <h3>{result["first_name"]}</h3>
                                     <span>
                                        <img src={redx} alt="" className="remove-icon-fc" id={`red-${i}`} onClick={(e) => handleCandidateSelection(e,'remove')}/>
                                        <img src={checkbox} alt="" className="remove-icon-fc" id={`check-${i}`} onClick={(e) => handleCandidateSelection(e,'add')}/> 
                                     </span>
                                  </div>
                            ))}
                        </div>
                        <div className="candidates-fc"><h2>{`${selectedCandidates.length} Candidates Selected`}</h2></div>
                    </div>    
                    </div>}
                    </div>}
                <div className="add-surveys-c">
                    {!isSecondCampaignSlide ?
                    <div className="add-survey-cover">
                        <h2>Get Creative ✨</h2>
                    </div>
                     :  !isThirdCampaignSlide ?<div className="add-surveys">
                         <h2>Search & Add Surveys</h2>
                         <div className="search-wrap-as">
                        <div className="search-section">
                         <div className="search-as">
                            <span>
                            <img src={search} alt="" id="search-icon"/> 
                            <input type="text" placeholder="Search" name="search" id="search-input" onChange={(e) => handleSearch(e,'/campaign/search/survey',setSurveyResults, surveySearchResults)}/> 
                            </span>
                         </div>
                         <div className="pool-as">
                            {surveySearchResults.map((result,i) =>(
                                <div className="result-as" key={i} id={`result-${i}`}>
                                    <span>
                                        <h3>{result.survey_title}</h3>
                                        <p>{result.survey_ref}</p>
                                    </span>
                                    <div onClick={(e) => addSurveySelection(e)}>
                                        <div id="p1-as"></div>
                                        <div id="p2-as"></div>
                                    </div>
                                </div>
                            ))}
                         </div>
                        </div> 
                        <div className="result-section">
                            <h3>Current Selections</h3>
                            <div className="result-pool">
                                {resultPool.map((result,i) => (
                                    <div key={i}>
                                        <p>{result.name}</p>
                                        <img src={x} alt="" className="x-icon" id={`x-${i}`} onClick={(e) => removeSurveySelection(e)}/>  
                                    </div>
                                ))}
                            </div>
                           {resultPool.length > 0 &&  <div className="finish-btn-rs"><button onClick={() => handleCampaignThirdSlide()}>Advance</button></div>}
                        </div>
                        </div>
                        </div> : <div className="finish-campaign-right">
                            <h2>Almost Finished 😁</h2>
                            {selectedCandidates.length && <div className="campaign-submit-btn"><button onClick={(e) => handleCampaignDataSubmit(e,{...campaignData,user_id:data.employee.employee_id})}>Finish</button></div>}
                            </div>}
                </div>
            </div> :
            <div className="survey-cs">
                {!isSecondSurveySlide ? 
                <div className="survey-first-slide">
                    <h2>Tips & Tricks</h2>
                    <div className="tt-wrap-cs">
                        <div>
                            <h4>.1 Clear Objective & Target Audience 🎯</h4>
                            <p>Clearly define the purpose of your survey and identify the specific information you aim to gather. Knowing your target audience is crucial to framing questions appropriately and ensuring the survey is relevant to respondents. This clarity enhances the survey's effectiveness and provides actionable insights.</p>
                        </div>
                        <div>
                            <h4>.2 Design Thoughtful and Unbiased Questions 🤔</h4>
                            <p>Craft questions that are clear, concise, and free from bias. Avoid leading or loaded questions that may influence respondents. Use a mix of question types (multiple choice, open-ended, etc.) to gather diverse data. Pilot-test your survey with a small group to identify any confusing or ambiguous questions before distributing it widely.</p>
                        </div>
                        <div>
                            <h4>.3 Engage Respondents and Provide Context 😁</h4>
                            <p>Enhance respondent engagement by explaining the survey's purpose, assuring anonymity, and indicating the estimated completion time. Consider using incentives to encourage participate.</p>
                        </div>
                    </div>
                    <div className="start-btn-cs"><button onClick={() => surveyTransitionSlide('toSecond')}>Begin</button></div>
                </div>
                : !isThirdSurveySlide ? <div className="survey-second-slide">
                    <h2>Build Your Survey 🔨</h2>
                    <div className="survey-builder">
                        <div className="components-cs">
                            <div id="mc" onClick={(e) => handleComponentAdd(e)}>
                                <h3>Multiple Choice</h3>
                            </div>
                            <div id="likert" onClick={(e) => handleComponentAdd(e)}>
                                <h3>Likert</h3>
                            </div>
                            <div id="meter" onClick={(e) => handleComponentAdd(e)}>
                                <h3>Meter</h3>
                            </div>
                        </div>
                        <div className="emulate-wrap">
                            {surveyBuilderSelections.length ? surveyBuilderSelections.map((survey,i) => (
                                <div className="emulate" style={{backgroundColor:`rgba(${survey.color},.1)`}} id={`em-${i}`} key={i}>
                                     {isBuildSet[i] ? <div className="set-em">
                                        <h1>Set ✅</h1>
                                        <button onClick={(e) => handleComponentSet(e,'reverse')}>Reverse</button>
                                        </div> : <> 
                                     <div className="emulate-header">
                                      <img src={redx} alt="" className="icon-eh" onClick={(e) => handleComponentRemoval(e)}/>
                                     <h3 style={{color:`rgb(${survey.color})`}}>{survey.type}</h3>
                                     <img src={checkbox} alt="" className="icon-eh" onClick={(e) => handleComponentSet(e,'set')}/>
                                     </div>
                                     <div className="enter-question">
                                         <label style={{color:`rgb(${survey.color}`}}>Define Question</label>
                                         <div className="inputs-eq">
                                            <input type="text" placeholder="Enter" id="question" name="question" style={{backgroundColor:`rgba(${survey.color},.5)`}} 
                                            value={surveyBuilderData[i]?.question} onChange={(e) => handleBuilderData(e,100,i)}/>
                                            <p style={{color:`rgb(${survey.color})`}}>{`${builderQuesitionCount[i]}/100`}</p>
                                         </div>
                                     </div>
                                     {survey.type === 'Multiple Choice' && <div className="multiple-choice-eq">
                                        <span>
                                        <input type="text" placeholder="Enter Answer" name="answer1" 
                                        value={surveyBuilderData[i]?.answer1} onChange={(e) => handleBuilderData(e,22,i)}/>
                                        <p>{`${builderAnswerCount[i][0] ||  0}/22`}</p>
                                        </span>
                                        <span>
                                        <input type="text" placeholder="Enter Answer" name="answer2" 
                                        value={surveyBuilderData[i]?.answer2} onChange={(e) => handleBuilderData(e,22,i)}/>
                                        <p>{`${builderAnswerCount[i][1] || 0}/22`}</p>
                                        </span>
                                        <span>
                                        <input type="text" placeholder="Enter Answer" name="answer3" 
                                        value={surveyBuilderData[i]?.answer3} onChange={(e) => handleBuilderData(e,22,i)}/>
                                       <p>{`${builderAnswerCount[i][2] || 0}/22`}</p>
                                        </span>
                                        <span>
                                        <input type="text" placeholder="Enter Answer" name="answer4" 
                                        value={surveyBuilderData[i]?.answer4} onChange={(e) => handleBuilderData(e,22,i)}/>
                                        <p>{`${builderAnswerCount[i][3] || 0}/22`}</p>
                                        </span>
                                        </div>}
                                    {survey.type === 'Likert' && <div className="likert-eq">
                                    <span>
                                        <p>Disagree</p>
                                        <input type="radio" className="radio-mc" name="mc"/>  
                                        </span>
                                        <span>
                                        <p>Somewhat Disagree</p>
                                        <input type="radio" className="radio-mc" name="mc"/>  
                                        </span>
                                        <span>
                                        <p>Neutral</p>
                                        <input type="radio" className="radio-mc" name="mc"/>  
                                        </span>
                                        <span>
                                        <p>Somewhat Agree</p>
                                        <input type="radio" className="radio-mc" name="mc"/>  
                                        </span>
                                        <span>
                                        <p>Agree</p>
                                        <input type="radio" className="radio-mc" name="mc"/>  
                                        </span>
                                        </div>}
                                    {survey.type === 'Meter' && <div className="meter-eq">
                                         <div className="meter-scale">
                                            <span>
                                                <p>1</p>
                                            </span>
                                            <span>
                                                <p>2</p>
                                            </span>
                                            <span>
                                                <p>3</p>
                                            </span>
                                            <span>
                                                <p>4</p>
                                            </span>
                                            <span>
                                                <p>5</p>
                                            </span>
                                         </div>
                                         <div className="line-meter"></div>
                                        </div>} </>
} 
                                </div>
                            )) : <h2 id="defaul-value-cs">Click On Components To Add Questions 🖱️</h2>}
                        </div>
                        <div className="advance-second-slide"><button onClick={() => surveyTransitionSlide('toThird')}>Advance</button></div>
                    </div>
                    </div> : <div className="survey-third-slide">
                        <div className="header-sts">
                       <h2>Set Survey Settings</h2>
                       <div className="save-template">
                           <h4>Save Template</h4>
                          <div className="temp-toggle-sts"><div onClick={(e) => handleEnableSaveTemplate(e)}></div></div>
                          {saveTemplate && <div className="temp-inputs"><input type="text" placeholder="Enter Name" id="save-temp-input" name="template" 
                          value={thirdSlideData.template} onChange={(e) => handleThirdSlideData(e,22)}/>
                           <p>{`${templateCount}/22`}</p>
                          </div>}
                       </div>
                       </div>
                       <div className="wrap-ts">
                          <div>
                            <label>Survey Title</label>
                            <span id="title-inputs-cs">
                            <input type="text" placeholder="Enter" id="survey-title-cs" name="surveyTitle" 
                            value={thirdSlideData.surveyTitle} onChange={(e) => handleThirdSlideData(e,22)}/> 
                             <p>{`${surveyTitleCount2}/22`}</p>
                            </span>
                          </div>
                          <div>
                            <label>Survey Description</label>
                            <span id="desc-cs">
                            <textarea placeholder="Enter" id="survey-desc-cs" name="description" value={thirdSlideData.description}
                            onChange={(e) => handleThirdSlideData(e,50)}></textarea> 
                            <p>{`${surveyDescCount2}/50`}</p>
                            </span>
                          </div>
                          <div>
                            <label>Survey Reference ID</label>
                            <input type="text" placeholder="Enter" id="survey-ref-cs" name="id"
                            value={thirdSlideData.id} onChange={(e) => handleThirdSlideData(e,null)}/> 
                          </div>
                          <div>
                            <label>Add To Campaign (Optional)</label>
                            <input type="text" placeholder="Enter" id="survey-campaign" name="campaign"
                            value={thirdSlideData.campaign} onChange={(e) => handleThirdSlideData(e,null)}/> 
                          </div>
                        </div> 
                        <div className="complete-cs"><button onClick={(e) => handleSurveyBuildSubmit(e,surveyBuilderData,thirdSlideData)}>Complete</button></div>   
                    </div>}
            </div>
}
        </div>
        <div className="templates-wrap">
            <div className="template-header">
            <button onClick={() => handleTemplateGoBack()}>Go Bock</button>
            <h1>Saved Templates</h1>
            </div>
            <div className="ltq-wrap">
                { isTemplateSlide ? 
                <div className="loaded-temp-wrap">
                <div className="loaded-temp">
                     <h1>{currentTemplate.template_title}</h1>
                     <div className="loaded-temp-questions">
                         {loadedTemplateQuestions.map((ques,i) =>  (
                            <div className="ltq" key={i}>
                                <h2>{ques.type}</h2>
                                <div className="input-ltq">
                                    <label>Define Question</label>
                                    <span id="def-question">
                                    <input type="text" placeholder="Enter" id="ltq-input" name="questionLTQ" 
                                    value={templateData[i]?.questionLTQ} onChange={(e) => handleTemplateData(e,50,i,false)}/>
                                    <p>{`${templateQuestionCounts[i]}/50`}</p>
                                    </span>
                                </div>
                                {ques.type === 'Likert' && <div className="likert-ltq">
                                        <span>
                                            <h3>Disagree</h3>
                                            <input type="radio"/>
                                        </span>
                                        <span>
                                            <h3>Somewhat Disagree</h3>
                                            <input type="radio"/>
                                        </span>
                                        <span>
                                            <h3>Neutral</h3>
                                            <input type="radio"/>
                                        </span>
                                        <span>
                                            <h3>Somewhat Agree</h3>
                                            <input type="radio"/>
                                        </span>
                                        <span>
                                            <h3>Agree</h3>
                                            <input type="radio"/>
                                        </span>
                                    </div>}
                                {ques.type === 'Multiple Choice' && <div className="mc-ltq">
                                   
                                        <span>
                                            <input type="text" placeholder="Enter Answer" id="mc-input-ltq" name="ltqAnswer1"
                                             value={multipleChoiceData?.ltqAnswer1} onChange={(e) => handleMultipleChoiceData(e,22,i)}/>
                                           <p>{`${multipleChoiceQuesitonCounts[i][0]}/22`}</p>
                                        </span>
                                        <span>
                                            <input type="text" placeholder="Enter Answer" id="mc-input-ltq" name="ltqAnswer2" 
                                             value={multipleChoiceData?.ltqAnswer2} onChange={(e) => handleMultipleChoiceData(e,22,i)}/>
                                            <p>{`${multipleChoiceQuesitonCounts[i][1]}/22`}</p>
                                        </span>
                                        <span>
                                            <input type="text" placeholder="Enter Answer" id="mc-input-ltq" name="ltqAnswer3"
                                             value={multipleChoiceData?.ltqAnswer3} onChange={(e) => handleMultipleChoiceData(e,22,i)} />
                                           <p>{`${multipleChoiceQuesitonCounts[i][2]}/22`}</p>
                                        </span>
                                        <span>
                                            <input type="text" placeholder="Enter Answer" id="mc-input-ltq" name="ltqAnswer4" 
                                            value={multipleChoiceData?.ltqAnswer4} onChange={(e) => handleMultipleChoiceData(e,22,i)}/>
                                           <p>{`${multipleChoiceQuesitonCounts[i][3]}/22`}</p>
                                        </span>
                                    </div>}
                                    {ques.type === 'Meter' && <div className="meter-ltq">
                                           <span>
                                             <h3>1</h3>
                                           </span>
                                           <span>
                                             <h3>2</h3>
                                           </span>
                                           <span>
                                             <h3>3</h3>
                                           </span>
                                           <span>
                                             <h3>4</h3>
                                           </span>
                                           <span>
                                             <h3>5</h3>
                                           </span>
                            
                                        </div>}
                            </div>
                         ))}
                     <div className="finish-ltq-wrap">
                        <h2>Edit Settings & Publish</h2>
                        <div className="finish-ltq">
                            <span>
                                <label>Survey Name</label>
                                <span id="name-fltq">
                                <input type="text" placeholder="Enter" name="surveyName" 
                                value={templateData.surveyName} onChange={(e) => handleTemplateData(e,22,0,true)}/>
                                <p>{`${publishSettingsCount[0]}/22`}</p>
                                </span>
                            </span>
                            <span>
                                <label>Add To Campaign (Optional)</label>
                                <input type="text" placeholder="Enter"  name="surveyCampaign"
                                value={templateData.surveyCampaign} onChange={(e) => handleTemplateData(e,1000,1,true)}/>
                            </span>
                            <span>
                                <label>Survey Reference ID (Optional)</label>
                                <input type="text" placeholder="Enter" id="name-fltq" name="surveyRef" 
                                value={templateData.surveyRef} onChange={(e) => handleTemplateData(e,1000,1,true)}/>
                            </span>
                            <span>
                                <label>Survey Desc</label>
                                <span id="desc-fltq">
                                <textarea name="surveyDescription" placeholder="Write Description" value={templateData.surveyDescription} onChange={(e) => handleTemplateData(e,50,2,true)}></textarea>
                                <p>{`${publishSettingsCount[2]}/50`}</p>
                                </span>
                            </span>
                        </div>
                        <div className="publish-temp"><button onClick={(e) => handleSurveyTemplateSubmit(e,templateData,multipleChoiceData)}>Publish</button></div>
                     </div>
                     </div>
                </div>
                </div> :
                <div className="templates">
               { savedTemplates.length ? savedTemplates.map((temp,i) => (
                    <div className="temp-card" key={i} onClick={() => handleTemplateSlide(i)}>
                        <h2>{temp.template_title}</h2>
                    </div>
                )) : <div className="clear-temp">
                     <h3>No Current Templates, Create A Survey First ⬆️</h3>
                    </div>
                    }
                    </div>
}
            </div>
        </div>
        <div className="reports-wrap">
            <h1>Reports</h1>
            <div className="reports">
                <div className="campaign-r">
                <div className="header-cr">
                <h2>Campaigns</h2>
                </div>
                <div className="campaign-reports">
                    {campaignReports.map((camp) =>(
                        <div className="report-cr">
                          <span>
                          <h2>{camp.title}</h2>    
                        </span> 
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </div>
        <div className="admin-permissions">
            <h1>Admin 🔑</h1>
            <div className="admin">
                <div className="admin-header">
                    <div id="perm1"><h2>Permissions</h2></div>
                    <div id="perm2"><h2>Manage Teams</h2></div>
                </div>
                {isPermissions ? 
                <div className="permissions-admin">
                    <h2>Handle Permissions</h2>
                    <div className="search-pa">
                        <div className="input-pa">
                            <span>
                            <img src={search} alt="" id="search-icon-pa"/>
                            <input type="text" placeholder="Search" id="input-pa" name="search" onChange={(e) => handleSearch(e,'/admin/search',setPermissionsPool,permissionsPool)}/>
                           </span>
                        </div>
                        <div className="pool-pa">
                            {permissionsPool.map((result,i) => (
                                <div className="result-pa" key={i} >
                                    <span>
                                    <h3>{result.first_name}</h3>
                                    <p>{result._role === "1" ? "Admin" : result._role === "2" ? "Manager" : "Employee"}</p>
                                    </span>
                                    <div className="pool-permissions-pa">
                                       <button id="promote-ppp" onClick={(e) => handlePromotion(e)}>Promote</button>
                                       <button id="demote-ppp" onClick={(e) => handleDemotion(e)}>Demote</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> : 
                <div className="manage-teams">
                   <span>
                   <h2>Create Team</h2>
                   <input type="text" placeholder="Enter Team Name" id="team-name" name="teamName" onChange={(e) => handleTeamCreationData(e)}/> 
                   </span>
                   <div className="search-mt">
                   <span id="pool-mt-header">
                            <label>Search Employee</label>
                            <input type="text" placeholder="Enter" name="search" onChange={(e) => handleSearch(e,'/admin/search',setMemberPool,memberPool)}/> 
                        </span>
                       <div className="pool-mt">
                        {memberPool.map((member,i) =>(
                            <div className="result-mt" key={i} id={`rm-${i}`}>
                               <h3>{member.first_name}</h3> 
                               <div className="add-btn-mt"><button onClick={(e) => handleAddTeamMember(e)}>Add</button></div>   
                            </div>
                        ))}
                        </div> 
                        <div className="selections-pa">
                            <div className="spa">
                                {memberPoolSelections.map((member) => (
                                    <div>
                                        <p>{member.first_name}</p>
                                        <img src={x} alt="" id="close-selection" onClick={(e) => handleRemoveTeamMember(e)}/>
                                    </div>
                                ))}
                            </div>
                            {memberPoolSelections.length && <div className="spa-btn"><button onClick={(e) => handleTeamCreation(e,teamName,memberPoolSelections)}>Create Team</button></div>}
                        </div>
                    </div>    
                </div>}
            </div>
        </div>
        </div>

    )

}

export default Dash