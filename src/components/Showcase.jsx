import React from 'react'; 
import checkbox from '../assets/checkbox.png'; 
import { useState, useEffect} from 'react'; 
import {useInView} from 'react-intersection-observer'; 


const Showcase = () =>{
    const [grid, setGrid] = useState(new Array(350).fill(true));
    const [ref,inView ] = useInView(); 

    const [pending, setPending] = useState(true);
    const [pending2, setPending2] = useState(true); 
    const [pending3, setPending3] = useState(true); 
    const [tab, setTab] = useState(true); 

    useEffect(() =>{
        setTimeout(() =>{
            const h1 = document.querySelector('.showcase-header h1'); 
            h1.classList.add('on'); 
          },1000)

          setTimeout(() =>{
             setPending(false)
          },2000)
          setTimeout(() =>{
            setPending2(false)
          },3500)
          setTimeout(() =>{
             setPending3(false); 
          },5000)
       
    },[])

    function revealTab(){
        const div = document.querySelector('.analytics'); 
        div.classList.toggle('active'); 

        setTab(!tab); 
    }
   return (
        <div className="showcase">
            <div className="grid-showcase">
            {grid.map((cell,i) =>(
                <div key={i}>{cell}</div>
            ))}
            </div>
            <div className="showcase-body-wrap">
                <div className="showcase-cover active">
                </div>
                <div className="showcase-body">

                    <div className="survey-animation">
                        <div className="wrap-s">
                            <div className="board-s">
                                <div className="header-s">
                                    <div id="clip-top"></div>
                                    <div id="clip-bottom"></div>
                                </div>
                                <div className="dividing"></div>
                                <div className="body-s">
                                    <div className="task-wrap">
                                    <div className="task">
                                    { pending ? <span className="loader"></span> : <img src={checkbox} alt="" className="check"/> } 
                                       <div className="fillers">
                                       <div className="f1"></div>
                                        <div className="f2"></div>
                                        <div className="f3-wrap">
                                        <div className="f3">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        <div className="f3">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        <div className="f3">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        </div>
                                       </div>
                                    </div>
                                    <div className="task">
                                    { pending2 ? <span className="loader"></span> : <img src={checkbox} alt="" className="check"/> 
} 
                                       <div className="fillers">
                                          <div className="f1"></div>
                                          <div className="f2"></div>
                                          <div className="f3-wrap">
                                        <div className="f3">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        <div className="f3">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        <div className="f3">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        </div>
                                       </div>
                                    </div> 
                                    <div className="task">
                                   { pending3 ? <span className="loader"></span> : <img src={checkbox} alt="" className="check"/> 
}
                                       <div className="fillers">
                                       <div className="f1"></div>
                                        <div className="f2"></div>
                                        <div className="f3-wrap">
                                        <div className="f3">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        <div className="f3">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        <div className="f3">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        </div>
                                       </div>    
                                    </div>   
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="showcase-header">
                        <h1><span className="R"><h1>R</h1></span>etrospective</h1>
                        <div className="header-options">
                         <p><span>360 <div id="degree"></div></span>  Survey Platform</p>
                         <div className="analytics-btn"><button onClick={() => revealTab()}>{tab ? 'Analytics' : 'Hide Analytics'}</button></div>
                        </div>
                    
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Showcase