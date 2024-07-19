import  { useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/sidebar';


export default function Team() {
    const token = localStorage.getItem("access_token");
    const usrData=JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"Groups":["Student"]}');

    const fetchData = async() => {
        
        const response = await axios.post(`${import.meta.env.VITE_URL}getteambydept/`, {
            departments:usrData["Departments"],
          },{
            headers: {
              Authorization: `Bearer ${token}`,
          }});
          console.log(response.data)
    }
    useEffect(()=>{fetchData()},[])
    return(
        <div>
            <Sidebar name={"Team"}/>
            <div className="absolute right-0 top-0 h-screen w-[85vw]">
                <div className="w-[80%] mx-auto">

                </div>
            </div>
        </div>
    )

}
