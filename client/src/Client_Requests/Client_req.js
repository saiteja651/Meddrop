import React from "react";
import Doc_Nav from "../Navbar/Doc_Nav";
export default function Client_req(){
    
    return(
        <>
        <div className="row">
         <div className="col-2">
         <Doc_Nav></Doc_Nav>
         </div>
        <div className="col-10">
            <h1>This part shows client requests</h1>
        </div>
        </div>
        </>
    )
}