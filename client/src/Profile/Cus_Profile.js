import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Profile.css"; // Import an external CSS file for styling (optional)
import Cus_Nav from "../Navbar/Cus_Nav";
import { ToastContainer, toast } from "react-toastify";
import API_LINK from "../api.link"

const Profile = () => {
    const tok = localStorage.getItem("user");
    const ans = tok.slice(1);
    const token = ans.slice(0, ans.length - 1);
    const [modal, setModal] = useState(false);
    const [data, setData] = useState();

    useEffect(() => {
        axios.get(`${API_LINK}/cus_profile`, {
            headers: {
                'x-token': token
            }
        }).then((res) => {
            setModal(true);
            setData(res.data);
           
        });
    }, [token]);

    return (
        <>
        <div  style={{backgroundColor:"#F0F3FF",height:"950px"}}>
        <div className="row"  style={{backgroundColor:"#F0F3FF"}}>
         <div className="col-2" style={{position:"fixed",top:0}}>
         <Cus_Nav></Cus_Nav>
         </div>
         <div className="col-3"></div>
        <div className="col-7">
        <center>
        <h1  style={{marginTop:"100px"}}></h1>
        
        </center>
        <div className="profile-container">
            <div className="profile-content mt-0">
                <h2 className="profile-heading">User Profile</h2>
                <div style={{ height: "3px", backgroundColor: "black", border: "none", marginBottom:"20px"}} />
                {
                    modal ?
                        <div className="profile-details" style={{marginBottom:"20x"}}>
                            <h3>Name: {data.name}</h3>
                            <h3>Email: {data.email}</h3>
                        </div>
                        : <p className="loading-message">Profile Loading...</p>
                }
            </div>
        </div>
        
        </div>
        </div></div>
        </>
        
    );
};

export default Profile;
