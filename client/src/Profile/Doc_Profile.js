import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Profile.css"; // Import an external CSS file for styling (optional)
import Cus_Nav from "../Navbar/Cus_Nav";
import Doc_Nav from "../Navbar/Doc_Nav";
import API_LINK from "../api.link"

const Doc_Profile = () => {
    const tok = localStorage.getItem("doctor");
    const ans = tok.slice(1);
    const token = ans.slice(0, ans.length - 1);
    const [data, setData] = useState();
    const [modal,setModal]=useState(false)
    const [rating,setRating]=useState()
    useEffect(() => {
        axios.get(`${API_LINK}/doctor_rating_avg`,{
            headers:{
                'x-token':token
            }
        }).then((res)=>{
            const totalRating = res.data.reduce((acc, rating) => acc + rating.rating, 0);
            const averageRating = totalRating / res.data.length 
            setRating(averageRating)
        })
        axios.get(`${API_LINK}/doctor_profile`, {
            headers: {
                'x-token': token
            }
        }).then((res) => {
            setModal(true)
            setData(res.data);
        });
    }, [token]);

    return (
        <>
        <div className="row" style={{backgroundColor:"#F0F3FF"}}>
         <div className="col-2" >
         <Doc_Nav></Doc_Nav>
         </div>
        <div className="col-10">
        <center>
        <h1  style={{marginTop:"100px"}}></h1>
        
        </center>
        <div className="profile-container">
            <div className="profile-content mt-0">
                <h2 className="profile-heading">My Info</h2>
                <div style={{ height: "3px", backgroundColor: "black", border: "none", marginBottom:"20px"}} />
                {
                    modal ?
                        <div className="profile-details" style={{marginBottom:"20x"}}>
                            <h3>Name: <b>{data.name}</b></h3>
                            <h3>Email: {data.email}</h3>
                            <h3>Rating: {rating.toFixed(2)}</h3>
                            <h3></h3>
                        </div>
                        : <p className="loading-message">Profile Loading...</p>
                }
            </div>
        </div>
        
        </div>
        </div></>
        
    );
};

export default Doc_Profile;
