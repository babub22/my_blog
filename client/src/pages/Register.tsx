import React, {useContext,useState} from 'react';
import {Box, Button, TextField, Typography} from "@mui/material";
import {useMutation} from "@apollo/client";
import {REGISTER_USER} from "../querys/mutation/article";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context/auth";

const Register = () => {
    const context=useContext(AuthContext)
    const [registerNewUser,{loading:loadingRegister,error:registerError}]=useMutation(REGISTER_USER)

    const navigate=useNavigate()

    const handleRegistration=()=>{

        !username ? setIsUsernameInvalid(true) : setIsUsernameInvalid(false)

        !password ? setIsPasswordInvalid(true) : setIsPasswordInvalid(false)

        !email ? setIsEmailInvalid(true) : setIsEmailInvalid(false)

        if(!isUsernameInvalid && !isPasswordInvalid && !isEmailInvalid){
            registerNewUser({
                variables: {
                    input: {
                        username,password,email
                    }
                }
            }).then(({data})=>{
                if(!loadingRegister){
                    context.login(data.registerNewUser)
                    navigate('/')
                }
            })
        }
    }

    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [email,setEmail]=useState('')

    const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const [isEmailInvalid,setIsEmailInvalid] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Typography variant='h4'>Registration</Typography>

            <Box sx={{mt:'3rem'}}>
                <Typography>Your name:</Typography>
                <TextField placeholder='Enter your name'
                           error={isUsernameInvalid}
                           helperText={isUsernameInvalid ? 'This field is required' : null}
                           onChange={e => setUsername(e.target.value)}
                           value={username}
                />

                <Typography>Email:</Typography>
                <TextField placeholder='Enter your email'
                           error={isEmailInvalid}
                           helperText={isEmailInvalid ? 'This field is required' : null}
                           onChange={e => setEmail(e.target.value)}
                           value={email}
                />

                <Typography>Password:</Typography>
                <TextField placeholder='Enter your password'
                           error={isPasswordInvalid}
                           helperText={isPasswordInvalid ? 'This field is required' : null}
                           onChange={e => setPassword(e.target.value)}
                           value={password}
                           type={showPassword ? "text" : "password"}
                           aria-label="toggle password visibility"
                />

                <br/>

                <Button onClick={() => setShowPassword(s => !s)}>Show/hide password</Button>

                <br/>

                <Button variant="contained" sx={{mt:'0.5rem'}} onClick={()=>{handleRegistration()}}>Register!</Button>

                {registerError?
                        <Typography sx={{color:'red', mt:'1rem'}}>{registerError.message}</Typography>
                    :null}
            </Box>
        </>
    );
};

export default Register;