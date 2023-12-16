import React from 'react'


const Default = ({className}) =>{
    return (
        <div className={className}>
            <h1> ⬆️ Looks Like Your Not Signed In, Sign In  <button onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>Here</button></h1>
        </div>
    )
}

export default Default