import React from "react";
import Doc_Nav from "../Navbar/Doc_Nav";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import apiLink from "../api.link";
export default function Design_Schedule() {
    const [selectedTimeRange, setSelectedTimeRange] = useState('');
    const [date, setDate] = useState();
    const data = {
        date: date,
        freehours: selectedTimeRange
    }
    const tok = localStorage.getItem("doctor");
    const ans = tok.slice(1);
    const token = ans.slice(0, ans.length - 1);
    const [schedule, setSchedule] = useState([])
    const submit = () => {
        console.log(data)
        setSelectedTimeRange('');
        setDate('')
        axios.post(`${apiLink}/design_schedule`, data, {
            headers: {
                'x-token': token
            }
        }).then((res) => {
            console.log(res.data)
        })

    }
    useEffect(() => {
        axios.get(`${apiLink}/get_schedule`, {
            headers: {
                'x-token': token
            }
        }).then((res) => {
            setSchedule(res.data);
        })
    }, [schedule])
    // Generate time range options
    const generateTimeRangeOptions = () => {
        let options = [];
        for (let hour = 0; hour < 24; hour++) {
            const timeStart = `${hour.toString().padStart(2, '0')}:00`;
            const timeEnd = `${(hour + 1).toString().padStart(2, '0')}:00`;
            const timeRange = `${timeStart} to ${timeEnd}`;
            options.push(timeRange);
        }
        return options;
    }

    // Handle time range selection
    const handleTimeRangeChange = (event) => {
        setSelectedTimeRange(event.target.value);
    }
    const del=(_id)=>{
        const data={
            _id:_id
        }
        axios.post(`${apiLink}/del_schedule`,data,{
            headers:{
                "x-token":token
            }
        }).then((res)=>{
            console.log(res.data)
        })
    }
    return (
       <div style={{backgroundColor:"#F0F3FF",height:"920px"}}>
        <div className="row" style={{backgroundColor:"#F0F3FF"}}>
            <div className="col-2" style={{ position: "fixed", top: 0 }}>
                <Doc_Nav></Doc_Nav>
            </div>
            <div className="col-3">
                <h1></h1>
            </div>
            <div className="col-7">
                <center>
                <div style={{width:"1000px"}}>
                    <h1 className="my-5">Design schedule</h1>
                    <div style={{ height: "3px", backgroundColor: "black", border: "none", marginBottom: "20px" }} />
                    <div className="mt-5">
                        <div className="my-3">
                            <h4>
                                <label className="mx-4 ">Enter The Date</label>
                                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" placeholder="enter date"></input>
                            </h4>
                        </div>
                        <label htmlFor="timeRange"><h4 className="my-3 mx-4">Select a Time Range:</h4></label>
                        <select id="timeRange" value={selectedTimeRange} onChange={handleTimeRangeChange}>
                            <option value="">Select</option>
                            {generateTimeRangeOptions().map((timeRange, index) => (
                                <option key={index} value={timeRange}>{timeRange}</option>
                            ))}
                        </select>
                        <div className="my-3">
                            <button className="btn btn-success" onClick={submit}>Design</button>
                        </div>
                    </div>
                </div>
                <h3 className="mt-4">My Schedule</h3>
                </center>
                <div className="row">
                <div className="col-2"></div>
                <div width="700px" className="col-10" style={{ display: "flex", flexWrap: "wrap",backgroundColor:"#F0F3FF"}}>
                    {schedule ?
                        schedule.map((element, index) => (
                            <div key={index} style={{ margin: "30px" }}>
                                <div style={{width:"300px",height:"200px",border:"1px solid black",borderRadius:"20px"}}>
                                    
                                    <div class="card-body">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item"><h4>Date:{element.date}</h4></li>
                                        <li class="list-group-item"><h5>time:{element.freehours}</h5></li>
                                        
                                    </ul>
                                   
                                        <center><button onClick={()=>{del(element._id)}} className="btn my-3 btn-danger">Delete Schedule </button></center>
                                    </div>
                                </div>
                            </div>
                        ))
                        : "No Schedule is Designed"
                    }
                </div>
            </div>
            </div>
          

        </div>
        </div>
    )
}