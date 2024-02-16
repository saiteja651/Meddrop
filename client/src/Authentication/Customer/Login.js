// import React, { useState } from "react";
// import axios from "axios";
// import "./Signup.css"; // Import your custom CSS file
// import { useNavigate } from "react-router-dom";
// import {toast } from "react-toastify";
// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate=useNavigate();
//   const submit = (e) => {
//     e.preventDefault();
//     const data = {
//       email: email,
//       pass: password,
//     };

//     axios.post("http://localhost:5000/cus_in", data)
//       .then((res) => {
//         console.log(res.data)
//         if(res.data==="wrong password"){
//           toast.error(res.data)
//         }
//         else if(res.data==="user doesnt exist create new account"){
//           toast.error(res.data)
//         }
//         else{
//         localStorage.setItem("user",JSON.stringify(res.data));
//         toast.success("logged in")
//         navigate("/cus_profile");
//         }
//       })
//       .catch((error) => {
//         console.error("Error submitting form:", error);
//     });

//     console.log(data);
//   };

//   return (
//     <div className="signup-container">
//       <center>
//         <h1>
//           MedDrop <span>Doctors At Your Doorstep</span>
//         </h1>
//         <form className="signup-form" style={{marginTop:"100px",width:"500px",borderRadius:"20px"}}>
//           <h2 className="my-3">Signup</h2>
//           <div className="mb-3">
//             <input
//               type="email"
//               className="form-control"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="mb-3">
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <p>
//             Doesnt have an account? <a href="/">Signup</a>
//           </p>
//           <button type="button" className="btn btn-success" onClick={submit}>
//             Submit
//           </button>
//         </form>
        
//       </center>
//     </div>
//   );
// };

// export default Login;


import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from "react";
import axios from "axios";
import "./Signup.css"; // Import your custom CSS file
import { useNavigate } from "react-router-dom";
import {toast, ToastContainer } from "react-toastify";
import API_LINK from '../../api.link';
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
  const navigate=useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    const dat = {
            email: data.get("email"),
            pass: data.get("password"),
          };
      
          axios.post(`${API_LINK}/cus_in`, dat)
            .then((res) => {
              console.log(res.data)
              if(res.data==="wrong password"){
                toast.error(res.data)
              }
              else if(res.data==="user doesnt exist create new account"){
                toast.error(res.data)
              }
              else{
              localStorage.setItem("user",JSON.stringify(res.data));
              toast.success("logged in Successfully")
              navigate("/cus_profile");
              }
            })
            .catch((error) => {
              console.error("Error submitting form:", error);
          });
      
          console.log(data);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(./client.png)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid style={{backgroundColor:"#F0F3FF"}} item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Client Sign in
            </Typography>
            <Box component="form"  noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <ToastContainer/>
                <Grid item>
                  <Link href="/" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}