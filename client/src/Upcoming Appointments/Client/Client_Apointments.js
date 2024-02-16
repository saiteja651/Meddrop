import React, { useEffect, useState } from "react";
import {Table} from "antd"
import Cus_Nav from "../../Navbar/Cus_Nav";
import axios from "axios";
import "./Client_Appointments.css"
import API_LINK from "../../api.link"

export default function Client_Appointments(){
    const [appointments,setAppointments]=useState([])
    const tok = localStorage.getItem("user");
    const ans = tok.slice(1);
    const token = ans.slice(0, ans.length - 1);
    const[modal,setModal]=useState(false)
    useEffect(()=>{
        axios.get(`${API_LINK}/client_appointments`,{
            headers:{
                'x-token':token
            }
        }).then((res)=>{
            console.log(res.data)
            setAppointments(res.data)
            console.log(appointments)
            setModal(true)
        })
    },[])
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
          title:"Doctor",
          dataIndex:"doctor"
        },
        {
            title:"photo",
            dataIndex:"photo",
            render: (text) => (
                <center>
                    <img src={text} alt="Avatar" style={{ width: 100, height: 100 }} />
                </center>
              ),

        },
        
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
        <div style={{backgroundColor:"#F0F3FF"}}>
        <div style={{backgroundColor:"#F0F3FF" }} >
        <div className="row">
        <div className="col-2" style={{position:"fixed",top:0}}><Cus_Nav></Cus_Nav></div>
        <div className="col-3"></div>
        <div className="col-8">
            <center>
            <h1 className="my-5">My Schedule</h1>
            <div style={{ height: "3px", backgroundColor: "black", border: "none", marginBottom:"50px"}} />
        {modal?<div style={{backgroundColor:"#F0F3FF"}}>
            {appointments.length>0?
        <div className="table-container" >
       
        <Table
                                columns={columns}
                                dataSource={appointments}
                                bordered // Add bordered prop to the Table component to display borders around cells
                                pagination={false} // Disable pagination to prevent horizontal scrolling
                                className="custom-table" // Add custom class for additional styling
                                style={{ border: "2px solid black", borderRadius: "10px" }}
                            />
        </div>
        :"No Appointments"}
        </div>:"No Upcoming Appointments"}
        
            </center>
        </div>
        </div>
        </div>
        </div>
        </>
    )
}