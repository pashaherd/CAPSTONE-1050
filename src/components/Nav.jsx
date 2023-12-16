import React from 'react'
import {useState, useEffect} from 'react'; 
import {ToastContainer, toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import eye from '../assets/eye.png'; 

const Nav = ({submitData}) =>{
    const [type, setType] = useState('password');
    const [displayLogin, setDisplayLogin] = useState('grid'); 
    const [displaySignUp, setDisplaySignUp] = useState('none');
    const [loginData, setLoginData] = useState({
        id:'',
        password:''
    }); 
    const [registerData, setRegisterData] = useState({
        company:'',
        employee:'',
        role:'',
        first_name:'',
        last_name:'',
        password:'',
        confirm:'',
        goal:''
    });
    
    useEffect(() =>{

        const handleClick = (e) =>{
            const loginDiv = document.querySelector('.login-wrap'); 

            if(e.target.className === loginDiv.className){
                loginDiv.classList.add('hidden'); 
                 loginDiv.style.zIndex = -1;    
    
            }
             console.log(e.target); 
        }
       window.addEventListener('click', handleClick)

       return () =>{
        window.removeEventListener('click', handleClick)
       }
    },[])
    function handlePasswordReveal(){      
        const input = document.querySelector('.password-reveal img'); 
        input.classList.toggle('clicked'); 
        if(type === 'password'){
            setType('text')
        } else {
            setType('password'); 
        }
    }

    function handleRevealLogin(){
        const loginDiv = document.querySelector('.login-wrap'); 

        loginDiv.classList.remove('hidden'); 
        loginDiv.style.zIndex = 100; 
    }

    function handleSwitch(method){
        const loginWrap = document.querySelector('.login-signup'); 
        const loginDiv = document.querySelector('.login'); 
        const signUpDiv = document.querySelector('.sign-up'); 
        if(method === 'toSign'){
            loginWrap.classList.add('sign'); 
            loginDiv.classList.add('hidden'); 
              setDisplayLogin('none')
            setDisplaySignUp('block')
            signUpDiv.classList.add('on'); 
        }

        if(method === 'toLogin'){
            signUpDiv.classList.remove('on')
            loginWrap.classList.remove('sign');
            
            setDisplaySignUp('none')
        
            setDisplayLogin('grid');
            loginDiv.classList.remove('hidden'); 
        }
    }

    function handleLoginData(e){
        const name = e.target.name; 
        const value = e.target.value; 

        setLoginData((prev) => ({
            ...prev, 
            [name]:value
        }))
    }

    function handleRegisterData(e){
        const name = e.target.name; 
        const value = e.target.value; 

        setRegisterData((prev) => ({
            ...prev,
            [name]:value
        }))
    }

    return (
        <>
        <div className="login-wrap hidden">
            <div className="login-signup">
                <div className="login" style={{display:displayLogin}}>
                <span className="login-header">
                <h1>Login</h1>
                <p>Dont Have An Account? Sign Up <button onClick={() => handleSwitch('toSign')}>Here</button></p>
                </span>
                <div className="input-wrap">
                    <span>
                        <label>Employee ID</label>
                        <input type="text" placeholder="Enter" id="username-login" name="id" 
                        value={loginData.id} onChange={(e) => handleLoginData(e)} />
                    </span>
                    <span>
                        <label>Password</label>
                        <div className="password-reveal">
                            <input type={type} placeholder="Enter" id="password-login" name="password" 
                            value={loginData.password} onChange={(e) => handleLoginData(e)}/> 
                            <img src={eye} alt="" id="eye-reveal" onClick={() => handlePasswordReveal()}/>
                        </div>
                    </span>
                </div>
                <div className="submit-btn-login"><button onClick={() => submitData('/login',loginData)}>Enter</button></div>
            </div>
            <div className="sign-up" style={{display:displaySignUp}}>
                <span className="sign-up-header">
                <h1>Sign Up</h1>
                <p>Already Have An Account? Login <button onClick={() => handleSwitch('toLogin')}>Here</button></p>
                </span>
                <div className="inputs-sign">
                    <span>
                        <label>Company ID</label>
                        <input type="text" placeholder="Enter" name="company" id="companyID" 
                        value={registerData.company} onChange={(e) => handleRegisterData(e)}/>
                    </span>
                    <span>
                        <label>Employee ID</label>
                        <input type="text" placeholder="Enter" name="employee" id="employeeID" 
                        value={registerData.employee} onChange={(e) => handleRegisterData(e)}/>
                    </span>
                    <span>
                        <label>Role</label>
                        <input type="text" placeholder="Enter" name="role" id="role" 
                        value={registerData.role} onChange={(e) => handleRegisterData(e)}/>
                    </span>
                    <div className="fl-sign">
                    <span>
                        <label>First Name</label>
                        <input type="text" placeholder="Enter" name="first_name" id="first_name" 
                        value={registerData.first_name} onChange={(e) => handleRegisterData(e)}/>
                    </span>
                    <span>
                        <label>Last Name</label>
                        <input type="text" placeholder="Enter" name="last_name" id="last_name" 
                        value={registerData.last_name} onChange={(e) => handleRegisterData(e)}/>
                    </span>
                    </div>
                    <span>
                        <label>Password</label>
                        <input type="password" placeholder="Enter" name="password" id="password-sign" 
                        value={registerData.password} onChange={(e) => handleRegisterData(e)}/>
                    </span>
                    <span>
                        <label>Confirm Password</label>
                        <input type="password" placeholder="Enter" name="confirm" id="confirm-password" 
                        value={registerData.confirm} onChange={(e) => handleRegisterData(e)}/>
                    </span>
                    <span>
                        <label>Tell Us About Your Goals 🎉</label>
                        <textarea placeholder="What Do You Plan To Achieve On This Platform?" name="goal" 
                        value={registerData.goal} onChange={(e) => handleRegisterData(e)}></textarea>
                    </span>
                </div>
                <div className="sign-up-button"><div><button onClick={() => submitData('/register', registerData)}>Sign Up</button></div></div>
            </div>
            </div>
        </div>
       <nav>
        <header>
        <div></div>
        <div className="logo-placeholder">
            <p>logo</p>
        </div>
        <ul>
            <li><button onClick={() => handleRevealLogin()}>Employee Login</button></li>
        </ul>
        </header>
        <div className="nav-footer"></div> 
       </nav>
       <ToastContainer/>
       </>
    )
}

export default Nav