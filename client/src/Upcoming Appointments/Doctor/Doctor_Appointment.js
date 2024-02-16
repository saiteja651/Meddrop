import React, { useEffect, useState } from "react";
import {Table} from "antd"
import Cus_Nav from "../../Navbar/Cus_Nav";
import axios from "axios";
import Doc_Nav from "../../Navbar/Doc_Nav";
import "./Doctor_Appointment.css"
import API_LINK from "../../api.link"

import { toast } from "react-toastify";

export default function Doctor_Appointments(){
    const [appointments,setAppointments]=useState([])
    const tok = localStorage.getItem("doctor");
    const ans = tok.slice(1);
    const token = ans.slice(0, ans.length - 1);
    
    useEffect(()=>{
        axios.get(`${API_LINK}/doctor_appointments`,{
            headers:{
                'x-token':token
            }
        }).then((res)=>{
          console.log(res.data)
            setAppointments(res.data)
        })
    },[appointments])
    
    const delet=(id)=>{
        const data={
           id:id
        }
        axios.post(`${API_LINK}/treated`,data,{
            headers:{
                'x-token':token
            }
        })
        toast.success("treartment completed successfully")
    }
    const columns=[
        {
          title:"Date",
          dataIndex:"date"
        },
        {
          title:"Time",
          dataIndex:"time"
        },
        {
          title:"Client",
          dataIndex:"result",
          keys:"name",
          render:item=>item[0]?.name
        },
        {
            title:"photo",
            dataIndex:"result",
            render: (text) => (
                    <div>
                    <img src={text[0].photo} alt="Avatar" style={{ width: 100, height: 100 }} />
                    </div>
              ),

        },
        {
            title:"treated",
            dataIndex:"_id",
          render:(_id,record)=><div>
            <button className='bt btn-success' onClick={()=>delet(_id)}>Treatment Done</button>
          </div>
        }
        
        // {
        //   title:"Image",
        //   dataIndex:"bookedon"
        // },
        // {
        //   title:"COMPLETED ON",
        //   dataIndex:"completedon"
        // }
      ]
      
    return(
        <>
        <div style={{backgroundColor:"#F0F3FF",height:"920px"}}>
        <div className="row"  >
        <div className="col-2" style={{position:"fixed",top:0}}><Doc_Nav></Doc_Nav></div>
        <div className="col-4"></div>
        <div className="col-7" style={{backgroundColor:"#F0F3FF"}}>
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
                <center>
                <th scope="col">Status</th>
               
                </center>
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
                 
                  
                  <td>
                    <center><button onClick={()=>delet(item._id)}>Treatment Done</button>
                </center>  </td>
                
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