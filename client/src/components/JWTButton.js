import React, {useEffect,useContext, useState} from "react";
import { AccountContext } from './Account';
import * as requests from "../util/Requests"

const JWTButton = (props) => {

    const {getUserSession} = useContext(AccountContext);
    
    const _onError = (error) => {
        console.error("JWTButton: ", error)
    }

    const _onSuccess = (data) => {
        console.log(data)
        alert("Success! Your comments have been added.")
        this.props.onClick()
    }

    const onClick = () =>{
        var url = "/test"

        getUserSession().then((data)=>{
            const axiosClient = requests.createClientWithAuthToken(
                data.session
            )
            axiosClient.get(url).then((response) => {
                console.log("response_data:",response.data)
                console.log("response_headers",response.headers)
            }).catch(err=>{
                console.error(err);
            })
        }).catch(err => {
            console.error("user session error",err);
        })
    };






    return (
        <button onClick={onClick}>Click Me</button>
    )

}



export default JWTButton;


