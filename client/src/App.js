import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom"
import Signup from './Authentication/Customer/Signup';
import "bootstrap/dist/css/bootstrap.min.css"
import Login from './Authentication/Customer/Login';
import DSignup from './Authentication/Doctor/Dsignup';
import Profile from './Profile/Cus_Profile';
import Cus_Nav from './Navbar/Cus_Nav';
import Appointment from './Appointment_Booking/Appointment';
import DLogin from './Authentication/Doctor/Dlogin';
import Doc_Profile from './Profile/Doc_Profile';
import Client_req from './Client_Requests/Client_req';
import Design_Schedule from './Design_Schedule/Design_Schedule';
import Client_Chat from './Chat/Client/Client_Chat_App';
import Client_Appointments from './Upcoming Appointments/Client/Client_Apointments';
import Doctor_Appointments from './Upcoming Appointments/Doctor/Doctor_Appointment';
import Comp_client_app from './Past Appointments/Clients/Comp_client_app';
import Doctors_reviews from './Doctors_Reviews/Doctors_reviews';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chat_App from './Chat/Doctor/Doctor_Chat_App';
import Doctor_Chat_App from './Chat/Doctor/Doctor_Chat_App';
import Client_Chat_App from './Chat/Client/Client_Chat_App';
import Comp_doctor_app from './Past Appointments/Doctors/Comp_doctor_app';


const App=()=>{
  return(
    <Router>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Signup></Signup>}></Route>
        <Route path='/client_login' element={<Login></Login>}></Route>
        <Route path='/book_app' element={<Appointment></Appointment>}></Route>
        <Route path='/cus_profile' element={<Protected><Profile></Profile></Protected>}></Route>
        <Route path='/cus_nav' element={<Protected><Cus_Nav></Cus_Nav></Protected>}></Route>
        <Route path='/doc_signup' element={<DSignup></DSignup>}></Route>
        <Route path='/doc_login' element={<DLogin></DLogin>}></Route>
        <Route path='/doc_profile' element={<Doctor><Doc_Profile></Doc_Profile></Doctor>}></Route>
        <Route path='/doc_clients' element={<Client_req></Client_req>}></Route>
        <Route path='/design_schedule' element={<Doctor><Design_Schedule></Design_Schedule></Doctor>}></Route>
        <Route path='/client_requests' element={<Client_req></Client_req>}></Route>
        <Route path='/doc_chat' element={<Doctor><Doctor_Chat_App></Doctor_Chat_App></Doctor>}></Route>
        <Route path='/client_chat' element={<Protected><Client_Chat_App></Client_Chat_App></Protected>}></Route>
        <Route path='/client_appointments' element={<Protected><Client_Appointments></Client_Appointments></Protected>}></Route>
        <Route path='/doctor_appointments' element={<Doctor><Doctor_Appointments></Doctor_Appointments></Doctor>}></Route>
        <Route path='/client_past_transactions' element={<Protected><Comp_client_app></Comp_client_app></Protected>}></Route>
        <Route path='/doctors_reviews' element={<Doctors_reviews></Doctors_reviews>}></Route>
        <Route path='/doctor_past_transactions' element={<Doctor><Comp_doctor_app></Comp_doctor_app></Doctor>}></Route>
        {/* <Route path='/client_payment' element={<Client_Payment></Client_Payment>}></Route> */}
      </Routes>
    </Router>
  )
}
export default App

export function Protected({children}){
  if(localStorage.getItem("user"))
  return children
  else
  return <Navigate to="/client_login"></Navigate>
}
export function Doctor({children}){
  if(localStorage.getItem("doctor")) return children
  else return <Navigate to="/doc_login"></Navigate>
}