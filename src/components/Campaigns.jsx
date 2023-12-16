import React from 'react'; 
import {useEffect, useState, useRef} from 'react'; 


const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([{title:'Black Ahh Titties', desc:'i heart big black ahh titties alottttt', campaign_start_date:'Today', campaign_end_date:'ForEver', survey_group:[{survey_name:'Bean'}]}])
    return (
      <div className="campaign-display-wrap">
        <div className="header-cd">
        <h1>Campaigns 🚀</h1>
        </div>
        <div className="campaign-display"> 
            {campaigns.map((camp,i) => (
                <div className='cd-wrap' key={i}>
                  <span className="cd-header">
                     <h2>{camp.title}</h2>
                     <p>{camp.desc}</p>
                     <p id="date">{`${camp.campaign_start_date} - ${camp.campaign_end_date}`}</p>
                  </span>
                  <div className="nested-surveys-cd">
                     {camp.survey_group.map((group,i) => (
                        <div key={i}>
                            <h3>{group.survey_name}</h3>
                            <div className="begin-btn-cd"><button>Begin</button></div>
                        </div>
                     ))}
                  </div>
                </div>
            ))}
        </div>
      </div>
    )
}

export default Campaigns