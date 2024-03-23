import React from "react";

import { useNavigate } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import axios from "axios";


export default function Searchbooks(){

   const navigate=useNavigate();

   const [input1,set_input]=React.useState({
       val:""
   });
   const [p_books,set_p_books]=React.useState([]);
   const [p_books1,set_p_books1]=React.useState([]);
   
   function handlevalue(event)
   {  const {name,value}=event.target;
      
      set_input({
        [name]:value
      })
   }
   async function handleClick()
   {
            const obj=input1;
           
            set_input({
                val:''
          })
          try{
          const res=await axios.post("http://127.0.0.1:8000/searched_books",obj);
               set_p_books(prev =>{
                  return [res.data[0],res.data[1],res.data[2]]
            })
            set_p_books1(prev=>{
               return [res.data[3],res.data[4],res.data[5]]
            })
          }
          catch(err)
          {
            navigate("/",{replace:true});
          }
          
           
   }

   const head1={fontSize:'30px',fontFamily:'fantasy',fontStyle:'italic',color:'red'}
   const imgg={height:'400px',width:'450px',borderRadius:'5%'};
return <>
         <div className="header" style={{display:"flex",justifyContent:"space-between"}}>
            <h2 onClick={()=>navigate("/",{replace:true})}>Login</h2>
           <h2 onClick={()=>navigate("/main",{replace:true})}> Search by Books</h2>
           <h2 onClick={()=>navigate("/users_books",{replace:true})}>Search by users</h2>
           <BsFillPersonFill size={"30px"} style={{cursor:"pointer"}} /> 
        </div>
        <br></br>
        <center>
       <u style={head1}>Recommendation based on Author,Publisher and Year of Publication</u>
       </center>
        <br></br>
        <div>
           
            <center>
             <input style={{width:'700px'}} name='val' value={input1.val} onChange={handlevalue} placeholder="Enter Book Title"></input>
            &nbsp;
            <button className="login_button" onClick={handleClick}>Search</button>
            </center>
           
        </div>
        <br></br>
        {  p_books && 
         
         <div>
               <div className="container"> 
                  {
                        p_books.map(item =>{
                        return <div className="styl1">
                              <img style={imgg} src={item["Image-url"]}></img>
                              <h4>ISBN : {item.ISBN}</h4>
                              <h4>Book Name : {item.Title}</h4>
                              <h4>Author: {item.Author}</h4>
                              <h4>Publisher : {item.Publisher}</h4>
                              <h4>Year of Publication : {item["Year"]}</h4>
                        
                        </div>
                     })
                  }
            </div>
             <br></br>
             <div className="container" style={{justifyContent:'space-around'}}> 
             {
                 p_books1.map(item =>{
                    return <div className="styl1">
                    <img style={imgg} src={item["Image-url"]}></img>
                          <h4>ISBN : {item.ISBN}</h4>
                          <h4>Book Name : {item.Title}</h4>
                          <h4>Author: {item.Author}</h4>
                          <h4>Publisher : {item.Publisher}</h4>
                          <h4>Year of Publication : {item["Year"]}</h4>
                    </div>
                 })
             }

        
      </div>
        </div>
     

        }

</>
}