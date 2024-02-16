import React, { useEffect, useState } from "react";
import Doc_Nav from "../Navbar/Doc_Nav";
import axios from "axios";
import { Table } from "antd"
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import NestedModal from "./Modal";
import API_LINK from "../api.link"

export default function Doctors_reviews(){
    const tok = localStorage.getItem("doctor");
    const ans = tok.slice(1);
    const token = ans.slice(0, ans.length - 1);
    const [data,setData]=useState([])
    const[modal,setModal]=useState(false)
    useEffect(()=>{
        axios.get(`${API_LINK}/for_doctors_reviews`,{
            headers:{
                'x-token':token
            }
        }).then((res)=>{
            setData(res.data)
            console.log(res.data);
            setModal(true)
        })
    },[])
    const columns = [
        {
            title: "Name",
            dataIndex: "result",
            keys:"name",
            render:item=>item[0].name
        },
        {
            title: "Rating",
            dataIndex: "rating"
        },
        {
            title: "Review",
            dataIndex: "description",

        },
        {
            title: 'Image',
            dataIndex: 'result',
            key: 'photo',
            render: (result) => (
                <center>
                    <img src={result[0]?.photo} alt="Avatar" style={{ width: 100, height: 100 }} />
                </center>
            )
        },
    ]
    return (
        <>
            <div className="row" style={{backgroundColor:"#F0F3FF"}}>
                <div className="col-2" style={{ position: "fixed", top: 0 }}><Doc_Nav></Doc_Nav></div>
                <div className="col-3"></div>
                <div className="col">
                    <center>
                        <div className="my-4">
                        <h1 className="my-4">My Reviews</h1>
                        <div style={{ height: "3px", backgroundColor: "black", border: "none", marginBottom:"40px"}} />
                        </div>
                        {/* <div className="table-container my-4">
                            <Table
                                columns={columns}
                                dataSource={data}
                                bordered // Add bordered prop to the Table component to display borders around cells
                                pagination={false} // Disable pagination to prevent horizontal scrolling
                                className="custom-table" // Add custom class for additional styling
                                style={{ border: "2px solid black", borderRadius: "10px" }}
                            />
                        </div> */}
                        </center>
                        <div className="mt-4 " style={{ display: "flex", flexWrap: "wrap" }}>
              {modal?
              <>
                {data.length ?
                data.map((element, index) => (
                  element.result && <div key={index} style={{ margin: "60px" }}>
                    <div  style={{ height: "300px", width: "300px",border:"2px solid black" }} >
                      <center><img src={element.result[0].photo} style={{ height: "150px", width: "150px", borderRadius: "100px" }} class="card-img-top" alt="..." /></center>
                     
                      <div>
                        <h4 class="mx-3">Mr &nbsp;{element.result[0].name}</h4>
                        <div style={{ height: "1px", backgroundColor: "black", border: "none", marginBottom:"40px",marginTop:"20px"}} />
                      </div>
                      <ul>
                        <li class="list-group-item"><h4>Rating&nbsp;:&nbsp;&nbsp;<Typography component="legend"></Typography>
                        <Rating style={{marginBottom:"0px"}}
                            name="read-only"
                            value={element.rating}
                           readOnly
                        /></h4></li>
                      </ul>
                     <NestedModal name={element.name} rating={element.rating} description={element.description}></NestedModal>
                    </div>
                    
                  </div>
                  
                ))
                : <h1>No doctors avaible</h1>
              }
              </>
              :""}
              
            </div>
                    {/* </center> */}
                    
                </div>
                </div>
            </>
            )
}