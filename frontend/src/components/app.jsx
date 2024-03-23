import { useState } from "react";
import { BiEnvelope } from "react-icons/bi";
import { FiLock } from "react-icons/fi";
import axios from "axios";
import 'reactjs-popup/dist/index.css';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const obj6={
   
    width:"100%",
    backgroundColor:"#FF2171",
    whiteSpace : "pre-wrap",
    wordWrap: "break-word",
    color:"white",
}
export default function App(){

    const navigate=useNavigate();
    const [joke,setJoke]=useState("");

    const [pop,setpop]=useState(false);


    const [inp,setInp]=useState({
        email:"",
        password:""
    });
    async function getJoke()
    {
        await axios.get("https://v2.jokeapi.dev/joke/Any?type=single")
        .then(response => setJoke(response.data.joke))

    }

     useEffect(()=>{
          getJoke();
     },[])

  

    function handle(event){
        const {name,value}=event.target;
        setInp(prev=>{
            return {
                ...prev,
                [name]:value
            }
        });
    }

    function forgot()
    {
        alert("forgot");
    }

    function handleSignup()
    {
          setpop(true);
    }

    

    async function handleButton()
    {    const obj=inp;
       
         setInp({
            email:"",
            password:""
       })

        try{
        const res=await axios.post("http://localhost:8000/checkData",obj);
       
            if(res.data==="success")
            navigate("main",{state:obj});
            else
            alert("Invalid Credentials");
        }
        catch(err){
            
            console.log(err);
        }
        
    }

    async function handleSubmit()
    {
        const obj=inp;
         setInp({
            email:"",
            password:""
       })
       try{
      
        const res=await axios.post("http://localhost:8000/setData",obj);
          
            if(res.data==="success")
           navigate("main",{state:obj});
           else
           alert("user already exist kindly signin or Forgot Password ?");
             
        }
        catch(err){
            
            console.log(err);
        }
        setpop(false);

    }

     function handleClose()
     {
        setpop(false);
     }
 
    const icon={
        position:"relative ",
        left:'140px',
        bottom:"30px"}
    
    return <div >
           <div style={obj6}>
           <center style={{fontSize:"20px"}}>
                <h4>Refresh to get a new joke</h4>
                <br></br>
                <p style={{fontFamily:"monospace",fontStyle:"oblique"}}>{joke}</p>
                </center>
            </div>
            <center>
        <div className="login" >
        
            <h1>Login</h1>
           <br></br><br></br>
           
            
                <input placeholder="Enter your email" type="email" name="email" value={inp.email} onChange={handle} ></input>
                <BiEnvelope size={"25px"} style={icon}/>
                <input placeholder="Enter your password" type="password" name="password" onChange={handle} value={inp.password} ></input>
                <FiLock size={"25px"} style={icon}/>
                <br></br>
                <span onClick={forgot}>Forgot password?</span>
               
                <br></br>
                
               <div style={{display:"flex",justifyContent:"space-evenly",marginTop:"30px"}}>
                <button  className="login_button" onClick={handleButton}>Signin</button>
                <button className="login_button" onClick={handleSignup}>Signup</button>
               </div>

             
                 {pop && 
                   
                    <div style={{width:"350px",height:"350px",backgroundColor:"#1450A3",borderRadius:"20px",position:"relative",bottom:"100%",right:"5%"}}>
                    <br></br>
                       <h1>Sign up</h1>
                    <br></br>
                    <br></br>
                  
                   
                   <input placeholder="Enter your email" type="email" name="email" value={inp.email} onChange={handle} ></input>
                <BiEnvelope size={"25px"} style={icon}/>
                <input placeholder="Create your password" type="password" name="password" onChange={handle} value={inp.password} ></input>
                <FiLock size={"25px"} style={icon}/>
                 <br></br>
                    <div style={{display:"flex",justifyContent:"space-evenly",alignItems:"center"}}>
                    <button className="login_button" onClick={handleSubmit}>Submit</button> 
                    <button className="login_button" onClick={handleClose}>Close</button> 
                    </div>
                 </div>
                
                 }
                 
       
        </div>
        </center>
    </div>
}
