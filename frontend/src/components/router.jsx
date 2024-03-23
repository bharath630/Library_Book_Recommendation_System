import React from "react";
import { BrowserRouter ,Route,Routes} from "react-router-dom";
import App from "./app";
import Main from "./main";
import Error from "./error";
import Searchbooks from "./search_books";
import Userbooks from "./users_books";


export default function Navigation(){
    return <div>
          <BrowserRouter>
            <Routes>
                <Route path="*" element={<Error/>}></Route>
                <Route path="/" element={<App />}></Route>
                <Route path="/main" element={<Main/>}></Route>   
               <Route path="/search_books" element={<Searchbooks/>}></Route>
               <Route path="/users_books" element={<Userbooks/>}></Route>
                
            </Routes>
          </BrowserRouter>
    </div>
}