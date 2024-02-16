import React, { useEffect, useState } from "react";
import Cus_Nav from "../../Navbar/Cus_Nav";
import axios from "axios";
import { Table } from "antd";
import "./Comp_client_app.css"
import { useNavigate } from "react-router-dom";
import { Button, Modal } from 'antd';

import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from "react-toastify";
import API_LINK from "../../api.link"

export default function Comp_client_app() {
    const tok = localStorage.getItem("user");
    const ans = tok.slice(1);
    const token = ans.slice(0, ans.length - 1);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [desc,setDesc]=useState()
    const [rec,setRec]=useState()
    const showModal = (record) => {
        setOpen(true);
        setRec(record)
    };
    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };
    const handleCancel = () => {
        setOpen(false);
    };

    
    const navigate = useNavigate();
    const [modal, setModal] = useState(false)
    const [reviewed_doctors,setReviewed_Doctors]=useState([])
    useEffect(() => {
        axios.get(`${API_LINK}/client_past_app`, {
            headers: {
                'x-token': token
            }
        }).then((res) => {
            setData(res.data)
        })
    }, [token]);
    
    useEffect(() => {
        axios.get(`${API_LINK}/doctor_review`, {
            headers: {
                'x-token': token
            }
        }).then((res) => {
            setReviewed_Doctors(res.data)
        })
    }, []); // No dependencies here, will run once on component mount
    
    const revi = (id,doctor_id) => {
        // navigate("/doctors_reviews")
        console.log("clicked",id)
        const data={
            rating:value,
            description:desc,
            reviewed_record:id,
            doctor_id:doctor_id
        }
       
        axios.post(`${API_LINK}/doctor_reviews`,data,{
            headers:{
                'x-token':token
            }
        }).then((res)=>{
            console.log(res.data);
        })
        setOpen(false)
        toast.success("Doctor Reviewed Successfully")
    }
    const [value, setValue] = React.useState(2);
    const columns = [
        {
            title: "Date",
            dataIndex: "date"
        },
        {
            title: "Time",
            dataIndex: "time"
        },
        {
            title: "Doctor",
            dataIndex: "result",
            keys: "name",
            render: item => item[0].name
        },
        {
            title: 'Photo',
            dataIndex: 'result',
            key: 'photo',
            render: (result) => (
                <center>
                    <img src={result[0]?.photo} alt="Avatar" style={{ width: 100, height: 100 }} />
                </center>
            )
        },
        {
            title: "Review Doctor",
            // dataIndex: "_id",
            render: (_id, record) => <div>
                      {console.log(reviewed_doctors)}
                      {!reviewed_doctors.includes(record._id) ? (
                        <Button className="btn btn-warning" onClick={()=>showModal(record)}>
                            <h5>Review Doctor</h5>
                        </Button>
                    ) : (
                        <Button className="btn btn-info" disabled>
                            <h5>Doctor Reviewed</h5>
                        </Button>
                    )
                } 
                
                <Modal
                    open={open}
                    title="Review The Doctor"
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button className="btn btn-danger" key="back" onClick={handleCancel}>
                            Cancel
                        </Button>,
                        <Button
                           className="btn btn-info"
                            loading={loading}
                            onClick={() => { revi(rec._id, rec.doctor_id) }}

                        >
                            Review
                        </Button>,
                    ]}
                >



                    <Box
                        sx={{
                            '& > legend': { mt: 2 },
                        }}
                    >

                        <Typography component="legend">Rating</Typography>
                        <Rating
                            name="simple-controlled"
                            value={value}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                        />
                    </Box>
                    <div className="my-4">
                        <label
                            htmlFor="message"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Enter Description
                        </label>
                        <textarea
                            rows="4"
                              value={desc}
                              onChange={(e) => setDesc(e.target.value)}
                            placeholder="The Doctor is good?"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        ></textarea>
                    </div>
                </Modal>
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
    return (
        <>
            
            <div className="row"  style={{backgroundColor:"#F0F3FF",height:"920px"}}>
                <div className="col-2" style={{ position: "fixed", top: 0,backgroundColor:"#F0F3FF" }}><Cus_Nav></Cus_Nav></div>
                <div className="col-3" style={{backgroundColor:"#F0F3FF"}}></div>
                <div className="col-8" style={{backgroundColor:"#F0F3FF"}}>
                    
                    <center >
                        <h1 className="my-5">My Past Transactions</h1>
                        <div style={{ height: "3px", backgroundColor: "black", border: "none", marginBottom:"50px"}} />
                        {/* <Table style={{border:"3px solid black"}} columns={columns} dataSource={data}></Table> */}
                        <div className="table-container">
                            <Table
                                columns={columns}
                                dataSource={data}
                                bordered // Add bordered prop to the Table component to display borders around cells
                                pagination={false} // Disable pagination to prevent horizontal scrolling
                                className="custom-table" // Add custom class for additional styling
                                style={{ border: "2px solid black", borderRadius: "10px" }}
                            />
                        </div>

                        <div>



                        </div>
                        <ToastContainer/>

                    </center>
                </div>

            </div>
            
        </>
    )
}