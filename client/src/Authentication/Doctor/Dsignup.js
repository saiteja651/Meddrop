// import React, { useState } from "react";
// import axios from "axios";
// import "./Dsignup.css"; // Import your custom CSS file

// const DSignup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [photo,setPhoto]=useState("");
//   const [url,setUrl]=useState("");
//   const submit = (e) => {
//     e.preventDefault();
//     const data = {
//       name: name,
//       email: email,
//       pass: password,
//       photo:photo,
//       url:url
//     };

//     axios.post("http://localhost:5000/doc_signup ", data)
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((error) => {
//         console.error("Error submitting form:", error);
//       });

//   };

//   return (
//     <div className="signup-container">
//       <center>
//         <h1>
//           MedDrop <span>Doctors At Your Doorstep</span>
//         </h1>
//         <form className="signup-form" style={{marginTop:"100px",width:"500px",borderRadius:"20px"}}>
//           <h2 className="my-3">Doctors Signup</h2>
//           <div className="mb-3">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>
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
//           <div className="mb-3">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Enter photo url"
//               value={photo}
//               onChange={(e) => setPhoto(e.target.value)}
//             />
//           </div>
//           <div className="mb-3">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Enter url of medical license"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//             />
//           </div>
//           <p>
//               Alreadu have an account?<a href="/doc_login">Login</a>
//           </p>
//           <button type="button" className="btn btn-success" onClick={submit}>
//             Submit
//           </button>
//         </form>
//       </center>
//     </div>
//   );
// };

// export default DSignup;
// 
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
import { useNavigate } from "react-router-dom";
import {toast } from "react-toastify";
import Photo from './Photo';

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

export default function Dsignup() {
  const navigate=useNavigate();
  const [image,setImage]=useState()
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      name:data.get("name"),
      email: data.get('email'),
      password: data.get('password'),
      image:image,
      specialization:data.get("spec")
    });
    const dat = {
            name:data.get("name"),
            email: data.get("email"),
            pass: data.get("password"),
            photo:image,
            specialization:data.get("spec")
          };
      
          axios.post(`${API_LINK}/doc_signup`, dat)
            .then((res) => {
              if(res.data==="user exist"){
                toast.error(res.data)
              }
              else{
              toast.success("Account Created Succesfully")
              navigate("/doc_login");
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
            backgroundImage: 'url(./doctor.png)',
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
              Doctor Sign Up
            </Typography>
            <Box component="form"  noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
              />

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
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="spec"
                label="Enter Specialization"
                name="spec"
                autoComplete="spec"
                autoFocus
              />
              <Photo setImage={setImage}></Photo>
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
                Sign Up
              </Button>
              <Grid container>
                
                <Grid item>
                  <Link href="/doc_login" variant="body2">
                    {"Already have an account? Sign In"}
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