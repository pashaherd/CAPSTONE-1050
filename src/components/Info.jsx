import React from 'react'; 
import {useEffect, useState} from 'react';
import {useInView} from 'react-intersection-observer'; 
import authentic from '../assets/auth.png';
import compassion from '../assets/selfcare.png'; 
import detail from '../assets/detail.png'; 

const Info = () =>{
    const [ref,inView] = useInView(); 
    const [cards, setCards] = useState(new Array(3).fill(false)); 


    useEffect(() =>{
      if(inView){
        const cards = Array.from(document.querySelectorAll('.card-i'));
        
        cards.forEach((card) =>{
            card.classList.add('active'); 
        })
      } 
    },[inView]);

    function handleFlip(e){
        let currentEl = e.target; 
        let condition;
        do{
        condition =  !Array.from(currentEl.classList).includes('card-i');  
        console.log(currentEl);
            console.log(Array.from(currentEl.classList)); 
          condition ?  currentEl = currentEl.parentNode : currentEl;     
    }while(condition)
            
       let flipIndex; 
       switch(currentEl.id){
        case 'c1':
            flipIndex = 0;
        break;
        case 'c2':
            flipIndex = 1; 
        break; 
        case 'c3':
            flipIndex = 2; 
        break; 
       }  
       let swap = [...cards]; 
       swap[flipIndex] = !swap[flipIndex]; 
       setCards(swap); 
        console.log(currentEl); 
     }
    return (
        <section className="info-wrap">
            <div className="tab-i">
          <h1>Guidelines 📃</h1>
          </div>
          <div className="info">
              <div className="card-i" ref={ref} id="c1">
                {cards[0] ? <div className="flipped">
                <p>Being authentic is the art of staying true to oneself, embracing one's values, beliefs, and emotions.</p>
                    <div className="card-btn"><button onClick={(e) => handleFlip(e)}>Revert</button></div>
                </div>: 
                <>
                 <img src={authentic} alt="" className="card-icon"/>
                 <span>
                 <h3>Authenticity</h3>
                 <p>Be authentic</p>
              </span>
              <div className="card-btn"><button onClick={(e) => handleFlip(e)}>Flip</button></div>
             </>
         }
              </div>
              <div className="card-i" id="c2">
                {cards[1] ? <div className="flipped">
                <p>
Being attentive is a crucial quality that involves the ability to focus one's mind and senses on a particular task, conversation, or situation.</p>
                    <div className="card-btn"><button onClick={(e) => handleFlip(e)}>Revert</button></div>
                </div> :
                <>
                <img src={detail} alt="" className="card-icon"/>
                 <span>
                 <h3>Attention to Detail</h3>
                 <p>Be Attentive</p>
              </span>
              <div className="card-btn"><button onClick={(e) => handleFlip(e)}>Flip</button></div>
             </>
        }
              </div>
              <div className="card-i" id="c3">
                { cards[2] ? <div className="flipped">
                    <p>
Being compassionate is a profound quality that involves a genuine concern for the well-being of others and a willingness to understand and alleviate their suffering.</p>
                    <div className="card-btn"><button onClick={(e) => handleFlip(e)}>Revert</button></div>
                </div> :
              <>
              <img src={compassion} alt="" className="card-icon"/>
                 <span>
                 <h3>Compassion</h3>
                 <p>Be compassionate</p>
              </span>
              <div className="card-btn"><button onClick={(e) => handleFlip(e)}>Flip</button></div>
              </>
    }
              </div>
          </div>
        </section>
    )
}


export default Info