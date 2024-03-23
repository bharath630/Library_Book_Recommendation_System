import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


export default function Profile()
{   const navigate=useNavigate(),location=useLocation();
    try{
         if(location.state===null)
          navigate("/",{replace:true});
    }
    catch(err)
    {
        navigate("/",{replace:true});
    }

    var total=0, completed=0 ,pending=0,deleted=0,sprint=0;

    async function refresh()
    {
        const res=await axios.post("http://localhost:8000/getData",{email:location.state});
        if(res.data.data==="failure");
        navigate("/",{replace:true});
        total=res.data.data.total_tasks;
        completed=res.data.data.completed_tasks;
        pending=res.data.data.pending_tasks;
        deleted=res.data.data.deleted_tasks;
    }

    React.useEffect(()=>{
          refresh();
    },[]);

    return <div className="profile">
            
    </div>
}