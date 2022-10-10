import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
	AuthenticationDetails
} from 'amazon-cognito-identity-js';


const CognitoUserPoolData = {
    UserPoolId: "ap-south-1_RCahvxZYV", //TODO: ENV variable
    ClientId: "6kh0q06n4hd43gg2l48gaikqia" //TODO: ENV variable
};

var UserPool = new CognitoUserPool(CognitoUserPoolData);
export {UserPool, CognitoUserAttribute, CognitoUser,	AuthenticationDetails}