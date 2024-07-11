import {Button} from "./components/ui/button"
import { Label } from "@/components/ui/label"
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {AlertDestructive} from "./components/Alert"
const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const history = useNavigate();


  const handleLogin = async (e:any) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        username: email,
        password: password,
      });
      setErr("");
      console.log(response);
      const token = response.data.token;
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("Data", JSON.stringify(response.data));
      history("/home");
    } catch (error:any) {
      setErr(error.response.data.error);
    }
  };

  

  return (
    <div className="flex w-screen">
      {err !== ""?
      <AlertDestructive description={err+", Please try again"} ></AlertDestructive>:null}
      <div className="w-[50%] h-screen my-auto">
        <form onSubmit={handleLogin} className="w-[60%] mx-auto h-fit my-auto pt-[15vh] flex flex-col  ">
        <h1 className="text-center font-bold text-[3.7ch] mb-[8vh]">Taskify</h1>
          <h1 className="text-center font-bold text-[3.5ch]">Log in to your account</h1>
          <h2 className="text-center text-gray-400  text-[1.9ch] mb-[5vh]">Welcome back! Please enter you details.</h2>
          <Label className="text-lg">Email</Label>
          <input type="text" className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh]" placeholder="example@gmail.com" onChange={(e) => setEmail(e.target.value)}></input>
          <Label className="text-lg mt-[3vh]">Password</Label>
          <input type="password" className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh] mb-[2vh]" placeholder="password" onChange={(e) => setPassword(e.target.value)}></input>
          <h2 className="text-center text-gray-400  text-[1.5ch] mb-[6vh]">Forgot your password? <a className="text-blue-400">Reset it</a></h2>
        <Button type="submit" className="bg-white px-[15%] text-black w-fit mx-auto hover:bg-gray-100 transition-all">Submit</Button>
        </form>
      </div>
      <img className="w-[50%] "></img>
    </div>
  );
};

export default SignupForm;
