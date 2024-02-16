import React, { useState } from "react";
import Cus_Nav from "../Navbar/Cus_Nav";
import "./Appointment.css"; // Import your CSS file if it's in a separate file
import axios from "axios";
import { useEffect } from "react";
import Alert from '@mui/material/Alert';
import { notification } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_LINK from "../api.link";
export default function Appointment() {
  const [spec, setSpec] = useState();
  const [date, setDate] = useState();
  const [desc, setDesc] = useState();
  const [arr_data, setArr_data] = useState([]);
  const [modal,setModal]=useState(false)
  
  const data = {
    specialization: spec,
    date: date,
    description: desc
  };
  const tok = localStorage.getItem("user");
  const ans = tok.slice(1);
  const token = ans.slice(0, ans.length - 1);

  const clic = (e) => {
    e.preventDefault();

    const special = {
      date: date,
      spec: spec
    };
    axios.post(`${API_LINK}/find_doctors`, special, {
      headers: {
        'x-token': token
      }
    }).then((res) => {
      console.log(res.data);
      setArr_data(res.data);
    });
    setModal(true)
  };
  const book = (date, time, doctor, img, doctor_id, ele_id, e) => {
    e.preventDefault();
    const data = {
      date: date,
      time: time,
      doctor: doctor,
      photo: img,
      doctor_id: doctor_id,
      ele_id: ele_id
    }
    console.log("book functoion called")
    axios.post(`${API_LINK}/my_appointments`, data, {
      headers: {
        'x-token': token
      }
    }).then((res) => {
      setArr_data(res.data)
      
      console.log(res.data)
    })
    
  }
  const initPayment = (data,date, time, doctor, img, doctor_id, ele_id, e) => {
    
    const options = {
      key: "rzp_test_AxxggAMmaYmfVX",
      amount: data.amount,
      currency: data.currency,
      name: "Doctor Appointment",
      description: "Test Transaction",

      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = `${API_LINK}/payments/verify`;
          const { data } = await axios.post(verifyUrl,response,{
            headers:{
              'x-token':token
            }});
          if(data.message==="Payment verified successfully"){
            toast.success("appointment booked succesfully")
            book(date, time, doctor, img, doctor_id, ele_id, e)
          }
          else{
           toast.error("appointment not booked")
          }
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  const handlePayment = async (date, time, doctor, img, doctor_id, ele_id, e) => {
    try {
      const orderUrl = `${API_LINK}/payments/orders`;
      const { data } = await axios.post(orderUrl, { amount: 100 },{
        headers:{
          'x-token':token
        }});
      console.log(data);
      initPayment(data.data,date, time, doctor, img, doctor_id, ele_id, e)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{backgroundColor:"#F0F3FF",height:"950px"}}>
    <div className="main row" style={{backgroundColor:"#F0F3FF"}}>
      <div className="col-2 " style={{ position: "fixed", top: 0,backgroundColor:"#F0F3FF" }}>
        <Cus_Nav></Cus_Nav>
      </div>
      <div className="col-3" style={{backgroundColor:"#F0F3FF"}}></div>
      <div className="col-7" style={{backgroundColor:"#F0F3FF"}}>
        <center>
          <div className=" profile-container" style={{ marginBottom: "100px" ,marginTop:"50px"}}>
            <div className="profile-content">
              <h2 className="mb-3">
                Book Appointment
              </h2>
              <div style={{ height: "3px", backgroundColor: "black", border: "none", marginBottom: "20px" }} />
              <form className="mt-4">

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Enter Date
                  </label>
                  <input
                    type="date"
                    placeholder="DD-MM-YYYY"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Enter Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="Orthodpedician"
                    value={spec}
                    onChange={(e) => setSpec(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                {/* <div className="mb-6">
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
                    placeholder="How can we help you?"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div> */}
                <button onClick={(e) => clic(e)}>
                  Search For Doctors
                </button>
              </form>
            </div>

          </div>

          <div className="row" style={{backgroundColor:"#F0F3FF",}}>
            <div className="col-2"></div>
            <div className="mt-4 " style={{ display: "flex", flexWrap: "wrap" }}>
              {modal?
              <>
                {arr_data.length ?
                arr_data.map((element, index) => (
                  element.result && <div key={index} style={{ margin: "60px" }}>
                    <div class="card" style={{ height: "500px", width: "400px" }} >
                      <center><img src={element.result[0].photo} style={{ height: "150px", width: "150px", borderRadius: "100px" }} class="card-img-top" alt="..." /></center>
                      <div class="card-body">
                        <h5 class="card-title">Dr.{element.result[0].name}</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                      </div>
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item"><h5>Date:{element.date}</h5></li>
                        <li class="list-group-item"><h5>Slot Timings:{element.freehours}</h5></li>
                        <li class="list-group-item"><h5>Consultancy Fee:</h5></li>
                        <h5><a className="mx-4" href="/">Rating : {element.result[0].rating}</a></h5>
                      </ul>
                      <div class="card-footer">
                        <button className="btn btn-success" onClick={(event) => {
                          handlePayment(element.date,element.freehours,element.result[0].name,element.result[0].photo,element.result[0]._id,element._id,event);
                        }}>Book Appointment</button>
                      </div>
                    </div>
                  </div>
                ))
                : <h1>No doctors avaible</h1>
              }
              </>
              :""}
              <ToastContainer/>
            </div>
          </div>
        </center>
      </div>

    </div>
    </div>
  );
}
