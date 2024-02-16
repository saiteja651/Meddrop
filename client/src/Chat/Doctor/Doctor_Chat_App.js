import "../Chat_App.css";
import io from "socket.io-client";
import { useState ,useEffect} from "react";
import Chat from "./Chat";

import Doc_Nav from "../../Navbar/Doc_Nav";
import axios from "axios";
import { set } from "mongoose";
import API_LINK from "../../api.link"
const socket = io.connect(`${API_LINK}`);

function Doctor_Chat_App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [arr_data,setArr_data]=useState([])
  const tok = localStorage.getItem("doctor");
    const ans = tok.slice(1);
    const token = ans.slice(0, ans.length - 1);
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };
  useEffect(()=>{
    axios.get(`${API_LINK}/doctor_profile`,{
    headers:{
      'x-token':token
    }
  }).then((res)=>{
    console.log(res.data);
    setUsername(res.data.name)
  })
  axios.get(`${API_LINK}/doctor_chat`,{
    headers:{
      'x-token':token
    }
  }).then((res)=>{
    setArr_data(res.data);
    console.log(res.data)
  })
  },[])
  const chat=(_id)=>{
    setRoom(_id)
    joinRoom();
  }
  return (
    <div className="row">
        <div className="col-2" style={{position:"fixed",top:0}}><Doc_Nav></Doc_Nav></div>
        <div className="col-4"></div>
        <div className="App col-5">
        <h1 className="mt-5">Client Chat</h1>
      <div style={{ height: "3px", backgroundColor: "black", border: "none", marginTop:"30px"}} />
      {arr_data.length>0?<div>
        {showChat ? (
          <Chat socket={socket} username={username} room={room} />
        ) : (
          
          <table className="table table-striped table-dark" style={{marginTop:"50px"}}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col"> Image</th>
                <th scope="col">Action</th>
                
              </tr>
            </thead>
            <tbody>
              {arr_data.map((item, index) => (
                <tr key={index}>
                  <td>{item.result[0].name}</td>
                  <td>{item.result[0].email}</td>
                 
                  <td>
                  <center><img src={item.result[0].photo} style={{height:"50px",width:"50px"}}></img>
                  </center></td>
                 
                  
                  <td>
                    <button onClick={() => { chat(item.result[0]._id) }}>Chat</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        )}
      </div>:<div className="mt-5">
        <h3>No Clients Avaiable to chat</h3>
        </div>}
       
      </div>
      </div>
  );
}

export default Doctor_Chat_App;