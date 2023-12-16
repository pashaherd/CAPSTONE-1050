import express from "express"; 
import { verifyToken } from "../middleware/verifyToken.js";
import db from '../config/db.js'; 
import path from 'path'
import { query, input } from '../config/methods.js'; 
import bcrypt from 'bcrypt'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fsPromises } from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Utils 
import signJWT from '../utils/signJWT.js'; 
import { calculateContributions, calculateRate }from '../utils/calculate.js'
import cleanSurveyAttempts from "../utils/cleanSurveyAttempts.js";
import sortGoals from "../utils/sortGoals.js";
import retrieveInactiveSurveys from "../utils/retrieveInactiveSurveys.js";
import constructInstructions from "../helpers/constructInstructions.js";
const router = express.Router(); 



db.getConnection((err,connection) =>{
    if(err){
        console.log('SQL ERR')
    }
    console.log(`SQL Connected`); 
})

 /*db.query(`SELECT * FROM surveys`, (err,res) =>{
    if(err){
        console.log(err)
    }
    console.log(res); 
})*/

// Sign JWT
router.get('/init', signJWT)
// Login / Register 

router.post('/login',verifyToken, async (req,res) =>{
    const data = req.body; 
    console.log(data); 
    
    try{
        const results = await query('SELECT * FROM employees'); 
        const employeeIDs = results.map(({employee_id,password}) => {
            return {employee_id,password}
        }); 
        
       const findID = employeeIDs.find((info) => info.employee_id === data.id); 
       if(!findID){
        return res.status(404).json({ok:false,msg:'User Not Found'})
       }
       const match = await bcrypt.compare(data.password, findID.password) 

       if(!match){
        return res.status(400).json({ok:false,msg:'Incorrect ID or Password'})
       }

        return res.status(200).json({ok:true, msg:'Login Succeeded', id:data.id});
    } catch(e){
        console.log(e)    
        return res.status(500).json({ok:false,msg:"Internal Server Error"})
    }
}); 


router.post('/register', verifyToken, async (req,res) =>{
   const data = req.body;  
   const role = data.role === 'Admin' ? 1 : data.role === 'Manager' ? 2 : data.role === 'Employee' ? 3 : null; 
   
   if(!role){
    return res.status(400).json({ok:false, msg:'Invalid Role'})
   }
   try{
    // Hash Password 
    bcrypt.hash(data.password, 10, async (err,hashedPassword) =>{
        if(err){
            throw new Error(err)
        }
      
    console.log(data); 
     const results = await input([data.company,data.employee,data.first_name,data.last_name,role,hashedPassword], 
        'INSERT INTO employees (company_id,employee_id,first_name,last_name,role,password) VALUES (?,?,?,?,?,?)')

        if(results !== true){
            return res.status(500).json({ok:false,msg:'Something Went Wrong'})
        }
    
        return res.status(200).json({ok:true,msg:'Success'})
    }) 
   } catch(e){
    console.log(e); 
    return res.status(500).json({ok:false,msg:'Internal Server Error'})
   }

})

router.get('/login/data/:id', verifyToken, async (req,res) =>{
     const id = req.params.id; 

     console.log(`The ID ${id}`);
     
     if(!id){
        return res.status(400).json({ok:false, msg:'ID Undefined'})
     }

     try{
        // Employee Data
        const employeeData = await query('SELECT * FROM employees WHERE employee_id = ?',[id]); 
        
        // Team Data
        const teamName = employeeData[0]["team_id"] ? employeeData[0]["team_id"] : ''; 
        const teamData = await query('SELECT * FROM teams WHERE team_name = ?',[teamName]);
        const allTeamsData = await query('SELECT * FROM teams');
        
        
        // Goals
        const allGoals = await query('SELECT * FROM goals WHERE goal_author = ? OR assigned_for = ? OR goal_author = ?',[teamName,id,id]);
        const sortedGoals = sortGoals(allGoals); 
        // Graph Calcs
        
       const contributions = await query('SELECT * FROM contributions WHERE user_c = ?',[id]); 
       const teamContributions = await query('SELECT * FROM contributions WHERE team_name = ?',[teamName]);

        const calculatedGraph = calculateContributions(contributions);
        const calculatedTeamGraph = calculateContributions(teamContributions); 
        const calculatedRates = calculateRate(contributions); 
        const allTeamEfforts = allTeamsData.map(({team_total_contributions}) => team_total_contributions);

        // All Notifications 
        const notis = await query('SELECT * FROM notifications WHERE notification_type = \'Public\' OR author = ? OR author = ?',[id,teamName])
        

        // Templates 
        const templates = await query('SELECT * FROM templates WHERE template_author_id = ?', [id]); 

       return res.status(200).json({ok:true, employee:employeeData[0],team:teamData[0],sortedGoals,calculatedGraph,calculatedRates,calculatedTeamGraph,allTeamEfforts,notis,templates})
     } catch(e){
        console.log(e); 
        return res.status(500).json({ok:false, msg:'Internal Server Error'})
     }
});
// DOMContentLoaded Data
  
router.get('/initial/data', verifyToken, async (req,res) =>{
    const loggedIn = JSON.parse(req.query.login)
    const id = req.query.id; 
    
    console.log(req.query); 
    try{
     const stories = await query('SELECT * FROM news'); 
     const completedSurveys = await query('SELECT * FROM surveys WHERE survey_status = \'Completed\''); 
     const surveyAttempts = loggedIn && await query('SELECT survey_attempts FROM surveys ');
     
     if(!surveyAttempts){
        console.log('send res')
        return res.status(200).json({ok:true, stories, completedSurveys, login:false,user:id})
     }
     const allSurveys = await query('SELECT * FROM surveys'); 
     const retrieveSurveys =  retrieveInactiveSurveys(id,allSurveys);
     const inactiveSurveys = retrieveSurveys.inactive; 
     const queryString = 'SELECT * FROM surveys WHERE ' + retrieveSurveys.clause; 

     const allInactiveSurveys = await query(queryString,[...inactiveSurveys])
     
     const incompletedSurveys = cleanSurveyAttempts(id,surveyAttempts);
     
     return res.status(200).json({ok:true, stories,completedSurveys,incompletedSurveys, allInactiveSurveys,user:id})
    }catch(e){
        console.log(e); 
        return res.status(500).json({ok:false, msg:'Internal Server Error'})
    }})

// Dash Routes 

// Update Story Posts

router.post('/update/posts', verifyToken, async (req,res) =>{
     const data = req.body; 
     console.log(data); 

     try{
        const result = await input('INSERT INTO news (author,caption,content) VALUES(?,?,?)',[data.author,data.caption,data.content]); 
         
        if(result !== true){
            return res.status(500).json({ok:false, msg:'Something Went Wrong'})
        }

        return res.status(200).json({ok:true, msg:'Submitted Successfully'})
        
     } catch(e){
        console.log(e); 
        return res.status(500).json({ok:false, msg:'Something Went Wrong'})
     }
})

// Upload Notification 
router.post('/upload/notification', verifyToken, async (req,res) =>{
    const data = req.body; 
    const first = data.author.split(" ")[0]; 
    const last = data.author.split(" ")[1]; 
    console.log(data); 
    try{
       if(data.type === 'Public'){
        const employeeData = await query('SELECT role FROM employees WHERE first_name = ? AND last_name = ?',[first,last])
          const isAuth = employeeData[0]["role"] < 3; 
          if(!isAuth){
             return res.status(403).json({ok:false, msg:'Permission Denied'})
          }
       }
       const result = await input('INSERT INTO notifications (author, notification_type, notification) VALUES(?,?,?)',[data.author,data.type,data.notification])
       if(result !== true){
        return res.status(500).json({ok:false, msg:'Internal Server Error'})
       }
       return res.status(200).json({ok:true})
    } catch(err){
        console.log(err); 
        return res.status(500).json({ok:false, msg:'Internal Server Error'})
    }
})


// Handle Assigining Goals 

router.post('/goal', verifyToken, async (req,res) =>{
     const data = req.body; 
     const goalType = data.team ? 'Team' : 'Personal'; 
     console.log(data);

     try{
         const result = await input('INSERT INTO goals (goal,goal_type,goal_author,goal_author_id) VALUES (?,?,?,?)',
         [data.ptGoal,goalType,data.author,data.id])
         if(result !== true){
            return res.status(500).json({ok:false, msg:'Something Went Wrong'})
         }
         return res.status(200).json({ok:true, msg:'Goal Submitted'});
     }catch(e){
        console.log(e);
        return res.status(500).json({ok:false, msg:'Internal Server Error'})
     }
})

router.post('/goal/assign', verifyToken, async (req,res) =>{
    const data = req.body; 
     
    console.log(data);
    try{
       const result = await input('INSERT INTO goals(goal,goal_type,goal_author,goal_author_id,assigned_for) VALUES (?,?,?,?,?)', 
       [data.assignedGoal,'Assignment', data.author, data.employeeId,data.id]);

       if(result !== true){
        return res.status(500).json({ok:false, msg:'Something Went Wrong'})
       }

       return res.status(200).json({ok:true, msg:'Successfully Assigned'})

    }catch(e){
        console.log(e); 
        return res.status(500).json({ok:false,msg:'Internal Server Error'})
    }
}); 


// Search Results 
router.post('/campaign/search/employee', verifyToken, async (req,res) =>{
    const value = req.body.query;
    const str = `SELECT * FROM employees WHERE first_name LIKE \'%${value}%\'`
    
    try{
       const result = await query(str); 
       if(!result){
        return res.status(500).json({ok:false,msg:'Internal Server Error'}) 
       }

       return res.status(200).json({ok:true, data:result})
    } catch(e){
        console.log(e); 
        return res.status(500).json({ok:false,msg:'Internal Server Error'})
    }
})


router.post('/campaign/search/survey', verifyToken, async (req,res) =>{
    const value = req.body.query;
    const queryStr = `SELECT * FROM surveys WHERE survey_title LIKE \'%${value}%\'`
    try{
       const result = await query(queryStr); 
       if(!result){
        return res.status(500).json({ok:false,msg:'Internal Server Error'}) 
       }

       return res.status(200).json({ok:true, data:result})
    } catch(e){
        console.log(e); 
        return res.status(500).json({ok:false,msg:'Internal Server Error'})
    }
})

router.post('/admin/search', verifyToken, async (req,res) =>{
    const value = req.body.query;
    const queryStr = `SELECT * FROM employees WHERE first_name LIKE \'%${value}%\'`
    try{
       const result = await query(queryStr); 
       if(!result){
        return res.status(500).json({ok:false,msg:'Internal Server Error'}) 
       }

       return res.status(200).json({ok:true, data:result})
    } catch(e){
        console.log(e); 
        return res.status(500).json({ok:false,msg:'Internal Server Error'})
    }
})
// Campaign Data
router.post('/campaign/submit', verifyToken, async (req,res) =>{
     const data = req.body;
     console.log(data);  

     try{
       const currentDate = Date.now();
       const date = new Date(currentDate).toString(); 
       const pool = JSON.stringify(data.survey_pool); 
       const assigned = JSON.stringify(data.assigned_for); 
       console.log(pool); 

       const inputData = await input('INSERT INTO campaigns(campaign_name,campaign_desc,campaign_ref,survey_group,assigned_for,campaign_start_date) VALUES (?,?,?,?,?,?)',
       [data.title, data.desc,data.ref,pool,assigned,date]
       ); 

       if(!inputData){
        return res.status(500).json({ok:false,msg:'Internal Server Error'})
       }

       return res.status(200).json({ok:true, msg:'Submitted Successfully'}) 
     }catch(e){
        console.log(e); 
        return res.status(500).json({ok:false,msg:'Internal Server Error'})
     }
})

// Survey Submit 

router.post('/survey/build', verifyToken, async (req,res) =>{
    const data = req.body.data;
    const build = req.body.build 

    try{
        const instructions = JSON.stringify(build); 
        const inputData = await input('INSERT INTO surveys(survey_title,survey_desc,survey_author, survey_author_id,survey_ref,survey_campaign,survey_status,survey_instructions) VALUES (?,?,?,?,?,?,?,?)',
        [data.surveyTitle,data.description,data.author,data.empid,data.id,data.campaign,'inactive',instructions])
        
        if(!inputData){
            return res.status(500).json({ok:false, msg:'Internal Server Error'})
        }
        // Add To Campaign
        if(data.campaign){
            const queryCampaign = await query('SELECT survey_group FROM campaigns WHERE campaign_name = ?',[data.campaign]) 
        
            if(queryCampaign.length){
               const group = JSON.parse(queryCampaign[0]["survey_group"]); 
               group.push({name:data.surveyTitle}); 
               const revertGroup = JSON.stringify(group); 

                await query('UPDATE campaigns SET survey_group = ? WHERE campaign_name = ?',[revertGroup,data.campaign]); 

            }       
        }

        // Save Template
        if(data.saveTemplate){
            const templateInput = await input('INSERT INTO templates (template_title, template_author, template_author_id, template_build) VALUES (?,?,?,?)', 
            [data.template,data.author,data.empid,instructions]); 

            if(!templateInput){
                return res.status(500).json({ok:true, msg:'Successful Submit, Failed To Save Template'})
            }
        }   

        return res.status(200).json({ok:true, msg:'Submitted Successfully'})
    } catch(e){
        console.log(e); 
        return res.status(500).json({ok:false, msg:'Internal Server Error'})
    }
})

// Template Submit 

router.post('/survey/template/submit', verifyToken, async (req,res) =>{
    const data = req.body.data;
    const nestedMultipleChoice = req.body.nest; 
    

    let j = data.length - 1; 
    const surveyData = data[j]; 

    try{
        const instructions = constructInstructions(data,nestedMultipleChoice);

        console.log(instructions); 
       const inputSurveys = await input('INSERT INTO surveys (survey_title,survey_desc,survey_author,survey_ref,survey_campaign,survey_status,survey_instructions) VALUES (?,?,?,?,?,?,?)',
       [surveyData.surveyName,surveyData.surveyDescription,surveyData.author,surveyData.surveyRef,surveyData.surveyCampaign,'inactive',instructions])
       
       if(!inputSurveys){
        return res.status(500).json({ok:false, msg:'Internal Server Error'})
       }

       if(surveyData.surveyCampaign){
          const queryCampaigns = await query('SELECT survey_group FROM campaigns WHERE campaign_name = ?', [surveyData.surveyCampaign])
          if(queryCampaigns.length){
            let group = queryCampaigns[0]["survey_group"];
            let parsedGroup = JSON.parse(group); 
            parsedGroup.push({name:surveyData.surveyName}); 
            let converted = JSON.stringify(parsedGroup); 
    
            
            await query('UPDATE campaigns SET survey_group = ? WHERE campaign_name = ?', [converted,surveyData.surveyCampaign])
          }
       }
       
       return res.status(200).json({ok:true, msg:'Submitted Successfully'})
    }catch(e){
        console.log(e); 
        return res.status(500).json({ok:false, msg:'Internal Server Error'})
    }
})
// Interact With ID Specific Surveys
router.get('/survey/:id',verifyToken,async (req,res) =>{
      const paramID = req.params.id;
      console.log(paramID);  
    
      try{
        let retrievedSurveyData = await query('SELECT * FROM surveys WHERE survey_ref = ?',[paramID]); 

        if(!retrievedSurveyData){
            return res.status(500).json({not:true,msg:"Internal Server Error"})
        }
          // Request Survey Data From DB
         return res.status(500).json(retrievedSurveyData); 
          // Send Survey Data TO Client 
      } catch(err){
        console.log(err.message)
         return res.status(500).json({not:true,msg:"Internal Server Error"})
      }
})

// Receive Survey Completion Data; 

router.post('/survey/submit', verifyToken, async (req,res) =>{
    const data = req.body; 

    try{
       console.log(data); 
       
       console.log(data.user_id); 
       console.log(data.surveyRef); 
       const querySurvey = await query('SELECT * FROM surveys WHERE survey_ref = ?',[data.surveyRef])
       const queryUser = await query('SELECT * FROM employees WHERE employee_id = ?',[data.user_id])
       console.log('queryed')
       // Update Info 
      let parseComments; 
      let parseAttempts; 
      const author = queryUser[0]["first_name"] + ' ' + queryUser[0]["last_name"]; 

       if(querySurvey[0]["survey_comments"]){
         parseComments = JSON.parse(querySurvey[0]["survey_comments"]);
         parseComments.push({author,comment:data.comment})
       } else {
        parseComments  = [{author,comment:data.comment}]
       }
       // Const Round Status; 
       const parseStatus = parseInt(data.surveyStatus); 
       const roundedStatus = Math.round(parseStatus * 100); 
       if(querySurvey[0]["survey_attempts"]){
        parseAttempts = JSON.parse(querySurvey[0]["survey_attempts"]); 
        parseAttempts.push({id:data.user_id,status:roundedStatus});
       }else {
        parseAttempts = [{id:data.user_id,status:roundedStatus}]
       }


       console.log(parseComments); 
       let updatedComments = JSON.stringify(parseComments); 
       let updatedAttempts = JSON.stringify(parseAttempts)
       let rating; 

       switch(data.rating){
        case "1":
            rating = "survey_rating_terrible"
            break; 
        case "2":
            rating = "survey_rating_bad";
            break; 
        case "3":
            rating = "survey_rating_neutral";
            break; 
        case "4":
            rating = "survey_rating_good"
       }

       let updateRating = querySurvey[0][rating] += 1;
       let queryStr = `UPDATE surveys SET ${rating} = ?, survey_comments = ?, survey_status = ?, survey_attempts = ? WHERE survey_ref = ?`;  
      const result =  await query(queryStr,[updateRating,updatedComments,'Completed',updatedAttempts,data.surveyRef])
    
      console.log(result)
       // Update Employee 

       const completedSurveysTotal = queryUser[0]["total_completed_surveys"] ? queryUser[0]["total_completed_surveys"] += 1 : 1; 
       const result2 = await query('UPDATE employees SET total_completed_surveys = ? WHERE employee_id = ?',[completedSurveysTotal,data.user_id]) 
       console.log(result2); 
       return  res.status(200).json({ok:true,msg:'Great Work 💪'}) 
    } catch(e){
      return  res.status(500).json({ok:false,msg:'Internal Server Error'})
    }
})

// Admin Page 


// Complete Admin Review 
// Super Admin Decides 

router.post('/survey/completion', verifyToken, (req,res) =>{
    const comments = req.body.adminComments; 
    const surveyID = req.body.surveyID; 

    try{
       // Find Corresponding Survey 
       // Extract Survey Stats & Add TO Complete Stat Table
       // Update Queue to Complete & remove row  


    } catch(e){
        return res.status(500).json({ok:false,msg:'Internal Server Error'})
    }
})



// Serve Frontend Files 

router.use(async (req, res, next) => {
    const filePath = path.join(__dirname, 'poc-client', 'dist', req.path);
  
    try {
      // Check if the request is for a JavaScript file
      if (req.path.endsWith('.js') && await fsPromises.access(filePath).then(() => true).catch(() => false)) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    } catch (error) {
      console.error('Error accessing file:', error);
    }
  
    // Continue to the next middleware or route
    next();
  });

router.use(express.static(path.join(__dirname,'poc-client','dist'))); 

router.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname,'poc-client','dist','index.html'))
})

export default router