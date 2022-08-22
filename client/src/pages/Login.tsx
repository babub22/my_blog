import React, {useContext,useState} from 'react';
import {Box, Button, TextField, Typography} from "@mui/material";
import {useMutation} from "@apollo/client";
import {LOGIN} from "../querys/mutation/article";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context/auth";

const Login = () => {
    const context=useContext(AuthContext)
    const [login,{loading:loadingLogin,error:registerError}]=useMutation(LOGIN)
    const navigate=useNavigate()

    const handleLogin=()=>{

        !username ? setIsUsernameInvalid(true) : setIsUsernameInvalid(false)

        !password ? setIsPasswordInvalid(true) : setIsPasswordInvalid(false)

        if(!isUsernameInvalid && !isPasswordInvalid){
            login({
                variables: {
                        username,
                        password
                }
            }).then(({data})=>{
                if(!loadingLogin){
                    context.login(data.login)
                    navigate('/')
                }
            }).catch(e=>{console.log(e)})
        }
    }

    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')

    const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);


    const [showPassword, setShowPassword] = useState(false);


    return (
        <>
            <Typography variant='h4'>Login</Typography>

            <Box sx={{mt:'3rem'}}>
                <Typography>Your name:</Typography>
                <TextField placeholder='Enter your name'
                           error={isUsernameInvalid}
                           helperText={isUsernameInvalid ? 'This field is required' : null}
                           onChange={e => setUsername(e.target.value)}
                           value={username}
                           sx={{width:"300px"}}
                />

                <Typography>Password:</Typography>
                <TextField placeholder='Enter your password'
                           error={isPasswordInvalid}
                           helperText={isPasswordInvalid ? 'This field is required' : null}
                           onChange={e => setPassword(e.target.value)}
                           value={password}
                           type={showPassword ? "text" : "password"}
                           aria-label="toggle password visibility"
                           sx={{width:"200px"}}
                />

                <br/>

                <Button onClick={() => setShowPassword(s => !s)}>Show/hide password</Button>

                <br/>

                <Button variant="contained" sx={{mt:'0.5rem'}} onClick={()=>{handleLogin()}}>Login</Button>

                {registerError?
                    <Typography sx={{color:'red', mt:'1rem'}}>{registerError.message}</Typography>
                    :null}
            </Box>
        </>
    );
};

export default Login;