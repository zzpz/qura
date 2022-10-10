import React, {createContext} from "react";
import {UserPool,CognitoUser,AuthenticationDetails} from "../util/Cognito";


// context for us to pass to our app's Outlet 
// (e.g when they hit /browse --> post to api the cognito ID to verify they're allowed?)
const AccountContext = createContext(); //what we use to determine if the current 'user' is logged in/etc

const Account = (props) => {


    // take the current user IF exists
    // return session else reject
    const getSession = async () => {
        return await new Promise((resolve,reject) =>{
            const user = UserPool.getCurrentUser();
            if (user) {
                user.getSession((err,session) =>{
                    if(err){
                        reject();
                    }else{
                        resolve(session);
                    }
                })
            } else {
                reject();
            }

        });
    }
    

    const authenticate = async (username, password) =>{ //email and password auth
        return await new Promise((resolve,reject) => {
            //ICognitoUserData
            var cognitoUserData = {
                Username: username,
                Pool: UserPool,
            }

            //IAuthenticationDetailsData
            var authDetailsData= {
                Username: username,
                Password: password,
            }

            const user = new CognitoUser(cognitoUserData);

            const authDetails = new AuthenticationDetails(authDetailsData);

            user.authenticateUser(authDetails,{
                //callbacks
                onSuccess: (data) => {
                    console.log("onSuccess: ", data);
                    resolve(data);
                },
                onFailure: (err)=> {
                    console.error("onFailure: ",err);
                    reject(err);
                },
                newPasswordRequired: (data) => {
                    console.log("newPasswordRequired: ", data);
                    resolve(data)
                },

            });
        });
    };

    return(
        <AccountContext.Provider value={{authenticate, getSession}}>
            {props.children}
        </AccountContext.Provider>
    )

};

export {Account, AccountContext};