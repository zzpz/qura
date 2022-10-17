import React, { createContext } from "react";
import { UserPool, CognitoUser, AuthenticationDetails } from "../util/Cognito";


// context for us to pass to our app's Outlet 
// (e.g when they hit /browse --> post to api the cognito ID to verify they're allowed?)
const AccountContext = createContext(); //what we use to determine if the current 'user' is logged in/etc

const Account = (props) => {
    document.title = "QUR Association"


    // take the current user IF exists
    // returns session + gets user attributes
    const getUserSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = UserPool.getCurrentUser();
            if (user) {
                user.getSession(async (err, session) => {
                    if (err) {
                        reject(err);
                    } else {

                        //get user attributes and return them
                        const attributes = await new Promise((resolve, reject) => {
                            user.getUserAttributes((err, attributes) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    //CognitoUserAttribute[] has been returned
                                    const attrs = {};
                                    attributes.forEach((cua) => {
                                        const { Name, Value } = cua;
                                        attrs[Name] = Value;
                                    })
                                    // console.log(attributes)
                                    resolve(attrs);
                                }
                            });
                        });
                        resolve({ user, session, attributes }); //bundle them up and resolve
                    }
                })
            } else {
                reject();
            }

        });
    };



    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = UserPool.getCurrentUser();
            if (user) {
                user.getSession(async (err, session) => {
                    if (err) {
                        reject(err);
                    } else {
                        //get user attributes and return them
                        resolve(session);
                    }
                })
            } else {
                reject();
            }

        });
    };


    const authenticate = async (username, password) => { //email and password auth
        return await new Promise((resolve, reject) => {
            //ICognitoUserData
            var cognitoUserData = {
                Username: username,
                Pool: UserPool,
            }

            //IAuthenticationDetailsData
            var authDetailsData = {
                Username: username,
                Password: password,
            }

            const user = new CognitoUser(cognitoUserData);

            const authDetails = new AuthenticationDetails(authDetailsData);

            user.authenticateUser(authDetails, {
                //callbacks
                onSuccess: (data) => {
                    console.log("onSuccess: ", data);
                    resolve(data);
                },
                onFailure: (err) => {
                    console.error("onFailure: ", err);
                    reject(err);
                },
                newPasswordRequired: (data) => {
                    console.log("newPasswordRequired: ", data);
                    resolve(data)
                },

            });
        });
    };

    const logout = () => {
        //create user variable to get current user if exists
        const user = UserPool.getCurrentUser();
        if (user) {
            user.signOut();
            console.log("logout");
        }//else you are a bot. 
        return
    }

    return (
        <AccountContext.Provider value={{ authenticate, getSession, getUserSession, logout }}>
            {props.children}
        </AccountContext.Provider>
    )

};

export { Account, AccountContext };