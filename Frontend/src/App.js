import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [message,setMessage] = useState("");

  const saveUser = async () => {

    try{

      const res = await axios.post("http://localhost:5000/saveUser",{
        name,
        email
      });

      setMessage(res.data.message);

    }catch(error){

      setMessage("Error saving user");

    }

  };

  return (

    <div className="container">

      <h2>User Registration</h2>

      <input
      placeholder="Enter Name"
      value={name}
      onChange={(e)=>setName(e.target.value)}
      />

      <input
      placeholder="Enter Email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      />

      <button onClick={saveUser}>
        Submit
      </button>

      <p>{message}</p>

    </div>

  );

}

export default App;