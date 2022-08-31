import React,{useReducer,createContext} from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";
import {User} from "../types/types";

const initialState={
    user:null
}

if (localStorage.getItem('jwtToken')) {
    const decodedToken:User = jwtDecode(localStorage.getItem('jwtToken') as string);

    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwtToken');
    } else {
        // @ts-ignore
        initialState.user = decodedToken;
    }
}

const AuthContext=createContext({
    user:null,
    login:(userData:any)=>{},
    logout:()=>{}
})

// @ts-ignore
function  authReducer(state,action){
    switch (action.type){
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user:null
            }
        default:
            return state;
    }
}

function AuthProvider(props:any){
    const [state,dispatch]=useReducer(authReducer,initialState)

    function login(userData:any){
        localStorage.setItem("jwtToken",userData.token)
        dispatch({
            type:'LOGIN',
            payload:userData
        })
    }

    function logout(){
        localStorage.removeItem("jwtToken")
        dispatch({type:'LOGOUT'})
    }

    return(
        <AuthContext.Provider value={{user:state.user,login,logout}} {...props} />
    )
}


export {AuthContext,AuthProvider}