import React, { useEffect, useState } from "react";
import {Table} from "antd"

import axios from "axios";
import Doc_Nav from "../../Navbar/Doc_Nav";

import API_LINK from "../../api.link"
import { toast } from "react-toastify";
export default function Comp_doctor_app(){
    const [appointments,setAppointments]=useState([])
    const tok = localStorage.getItem("doctor");
    const ans = tok.slice(1);
    const token = ans.slice(0, ans.length - 1);
    
    useEffect(()=>{
        axios.get(`${API_LINK}/comp_doctor_app`,{
            headers:{
                'x-token':token
            }
        }).then((res)=>{
          console.log(res.data)
            setAppointments(res.data)
        })
    },[appointments])
    
    
    
    return(
        <>
        <div style={{backgroundColor:"#F0F3FF",height:"920px"}}>
        <div className="row"  >
        <div className="col-2" style={{position:"fixed",top:0}}><Doc_Nav></Doc_Nav></div>
        <div className="col-4"></div>
        <div className="col-6" style={{backgroundColor:"#F0F3FF"}}>
            <center>
            <h1 className="mt-5 mb-3" >My Schedule</h1>
            <div style={{ height: "3px", backgroundColor: "black", border: "none", marginBottom:"20px"}} />
        {/* {appointments.length>0?
          <Table
          columns={columns}
          dataSource={appointments}
          bordered // Add bordered prop to the Table component to display borders around cells
          pagination={false} // Disable pagination to prevent horizontal scrolling
          className="custom-table" // Add custom class for additional styling
          style={{ border: "2px solid black", borderRadius: "10px",backgroundColor:"#F0F3FF" }}
      />
       :"No Appointments"} */}
            </center>
            {appointments.length>0?<center>
       
          
          <table className="table table-striped table-dark" style={{marginTop:"50px"}}>
            <thead>
              <tr>
                
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col"> Image</th>
                
              </tr>
            </thead>
            <tbody>
              {appointments.map((item, index) => (
                <tr key={index}>
                  
                  
                  <td>{item.result[0].name}</td>
                  
                  
                  <td>{item.result[0].email}</td>
                 
                 
                  
                  <td>
                  <center><img src={item.result[0].photo} style={{height:"70px",width:"70px"}}></img>
                  </center></td>
                 
                  
                
                
                </tr>
              ))}
            </tbody>
          </table>
      </center>:<div className="mt-5">
        <h3>No Appointments</h3>
        </div>}
       
        </div>
        </div>
        </div>
        </>
    )
}