import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
	AuthenticationDetails
} from 'amazon-cognito-identity-js';


const CognitoUserPoolData = {
    UserPoolId: process.env.REACT_APP_USER_POOL_ID, //TODO: ENV variable
    ClientId: process.env.REACT_APP_CLIENT_ID //TODO: ENV variable
};

var UserPool = new CognitoUserPool(CognitoUserPoolData);
export {UserPool, CognitoUserAttribute, CognitoUser,	AuthenticationDetails}

