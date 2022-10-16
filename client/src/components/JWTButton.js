import React, { useEffect, useContext, useState } from "react";
import { AccountContext } from './Account';
import * as requests from "../util/Requests"

const JWTButton = (props) => {

    const { getUserSession } = useContext(AccountContext);

    const _onError = (error) => {
        console.error("JWTButton: ", error)
    }

    const _onSuccess = (data) => {
        console.log(data)
        alert("Success! You have received signed cookies.")
        this.props.onClick()
    }

    const onClick = () => {
        var url = "/test"

        getUserSession().then((data) => {
            const axiosClient = requests.createClientWithAuthToken(
                data.session
            )
            axiosClient.get(url).then((response) => {
                _onSuccess(response.data);
            }).catch(err => {
                console.error("axios client error", err);
            })
        }).catch(err => {
            console.error("Cannot retrieve user session", err);
        })
    };






    return (
        <button onClick={onClick}>Click Me</button>
    )

}



export default JWTButton;


