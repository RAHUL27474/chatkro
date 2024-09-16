import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { apiConnector } from "../utils/Apiconnecter";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { bgGradient } from "../constants/color";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setuserdata } from "../redux/reducers/auth";

const Login = () => {
  const navigate=useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [input, setInput] = useState("");




  const toggleLogin = () => setIsLogin((prev) => !prev);

  // firstname = useInputValidation("");
  // lastname = useInputValidation("");
  // email = useInputValidation("");
  // username = useInputValidation("", usernameValidator);
  // password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      
      const { data } = await apiConnector(
        "POST",
        `${server}/api/v1/auth/login`,
        {
          input,
          password,
        },
        
      );
      console.log(data)
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      console.log("error is ",error);
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e) => {  
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    console.log(firstname)
    formData.append("avatar", avatar.file);
    formData.append("firstname", firstname);
    console.log(lastname)
    formData.append("lastname", lastname);
    console.log(email)
    formData.append("email", email);
    console.log(username)
    formData.append("username", username);
    console.log(password)
    formData.append("password", password);
    
    // const config = {
    //   withCredentials: true,
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // };

    try {
      // const formData1 = new FormData();
      // formData1.append("email", email);
      // formData1.append("username", username);
      // console.log(formData1)
      
      const response1=await apiConnector(
        "POST",
        `${server}/api/v1/auth/sendotp`,
        {email,username},
    )
    console.log("send otp respones => ",response1);
      if(response1?.data?.data?.success ){
        throw Error;
      }
      dispatch(setuserdata({
        firstname,lastname,email,username,password
      }))
      // dispatch(userExists(data.user));
      navigate("/verify-otp");
      // const { response1 } = await axios.post(
      //   `${server}/api/v1/auth/sendotp`,
      //   {
      //     email,
      //     username
      //   },
      //   config
      // );
      





      // const { data } = await axios.post(
      //   `${server}/api/v1/user/new`,
      //   formData,
      //   config
      // );

      // dispatch(userExists(data.user));
      // toast.success(data.message, {
      //   id: toastId,
      // });
      
    } catch (error) {
      console.log(error.message)
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: bgGradient,
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Email or Username"
                  margin="normal"
                  variant="outlined"
                  value={input}
                  onChange={(e)=>{setInput(e.target.value)}}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password}
                  onChange={(e)=>{setPassword(e.target.value)}}
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  Login
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>

                {avatar.error && (
                  <Typography
                    m={"1rem auto"}
                    width={"fit-content"}
                    display={"block"}  
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}
                
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  margin="normal"
                  variant="outlined"
                  value={firstname}
                  onChange={(e)=>{setFirstname(e.target.value)}}
                />

                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  variant="outlined"
                  value={lastname}
                  onChange={(e)=>{setLastname(e.target.value)}}
                />

                <TextField
                  required
                  fullWidth
                  label="Email Id"
                  margin="normal"
                  variant="outlined"
                  value={email}
                  onChange={(e)=>{setEmail(e.target.value)}}
                />
                
                
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username}
                  onChange={(e)=>{setUsername(e.target.value)}}
                />

                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Set Your Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password}
                  onChange={(e)=>{setPassword(e.target.value)}}
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  Sign Up
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
