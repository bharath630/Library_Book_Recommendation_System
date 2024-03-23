import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import axios from "axios";

export default function Main(){
    const navigate=useNavigate();
    const [p_books,set_p_books]=React.useState([]);
     const [p_books1,set_p_books1]=React.useState([]);
         useEffect(()=>{
         
            async function handlePopular()
            {
                  try{
                        
                     const ack=await axios.get("http://127.0.0.1:8000/popular_books");
                     
                     set_p_books(prev =>{
                           return [ack.data[0],ack.data[1],ack.data[2]]
                     })
                     set_p_books1(prev=>{
                        return [ack.data[3],ack.data[4]]
                     })
                  }
                  catch(err)
                  {     console.log("dn");
                        navigate("/",{replace:true});
                  }
            }

         
            handlePopular();
         },[])
  

     const head1={fontSize:'40px',fontFamily:'fantasy',fontStyle:'italic',color:'red'}
     const imgg={height:'400px',width:'450px',borderRadius:'5%'}

    
   

     return  <>
       <div className="header" style={{display:"flex",justifyContent:"space-between"}}>
            <h2 onClick={()=>navigate("/",{replace:true})}>Login</h2>
           <h2 onClick={()=>navigate("/search_books",{replace:true})} >Search for books</h2>
           <h2 onClick={()=>navigate("/users_books",{replace:true})}>Search by users</h2>
           <BsFillPersonFill size={"30px"} style={{cursor:"pointer"}} /> 
        </div>
       <br></br>
       <center>
       <u style={head1}>Popular Books</u>
       </center>
       <br></br>
      
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
                          <h4>No of Rating : {item.Ratings}</h4>
                          <h4>Avg Rating : {item.Avg_rating}</h4>
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
                          <h4>No of Rating : {item.Ratings}</h4>
                          <h4>Avg Rating : {item.Avg_rating}</h4>
                    </div>
                 })
             }

        
      </div>
     
     </> 
     
}
