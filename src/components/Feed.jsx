import React from 'react'; 
import { useState, useEffect, useRef} from 'react'; 
import bar from '../assets/bar-chart.png'; 

const Feed = () =>{
    const [feed, setFeed] = useState([{title:'Survey Results', description:'See Results From Users Survey'},{title:'Survey Results', description:'See Results From Users Survey'},{title:'Survey Results', description:'See Results From Users Survey'}
    ,{title:'Survey Results', description:'See Results From Users Survey'},{title:'Survey Results', description:'See Results From Users Survey'},{title:'Survey Results', description:'See Results From Users Survey'},{title:'Survey Results', description:'See Results From Users Survey'},{title:'Survey Results', description:'See Results From Users Survey'},{title:'Survey Results', description:'See Results From Users Survey'},{title:'Survey Results', description:'See Results From Users Survey'}]);
    const [percentages, setPercentages] = useState([]); 
    const [activate, setActivation] = useState([]); 
    const [currentCard, setCurrentCard ]= useState(0); 
    const [height,setHeight] = useState(0); 
    
    const spanRef = useRef(); 
    
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
 
        })
        cardCover.forEach((cover) =>{
            cover.addEventListener('mouseleave', (e) =>{
                console.log(e.target); 
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
        })
    },[])
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
                {feed.map((card,i) =>(
                <div className="feed-card" key={i}>
                    <div className="card-cover" id={`cd-${i}`} style={{background:`linear-gradient(180deg, aquamarine ${percentages[i]}%, rgba(255,255,255,0) 100%)`}}>
                        <span ref={spanRef}>
                        <h1>{card.title}</h1>
                        <p>{card.description}</p>
                        </span>
                    </div>
                    <div className="card-fx">
                    </div>
                    
                    <div className="card-info">
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus consequuntur dolor quos. Nisi ratione unde quod laborum, ducimus impedit quae.</p>
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