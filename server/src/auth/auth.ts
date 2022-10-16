// CORE
import * as config from "../config"; // config will one day be more used
import dotenv from "dotenv"
dotenv.config();

// Cognito specific


// JWT
import * as jose from "jose"
import { GetKeyFunction } from "jose/dist/types/types";

// routing
import express, { Router } from "express";
// file system for the *public* JSON Web Key Set downloaded from AWS
import { readFileSync } from "fs";
import path from "path";


// Cloudfront signed cookies
import {CloudfrontSignedCookiesOutput, getSignedCookies } from "@aws-sdk/cloudfront-signer";



// ROUTER
const router:Router = express.Router();


/////////////////
/// SET UP FOR AUTH:
///////////////
const jwksJSON = path.resolve(__dirname, '../../config/','jwks.json'); // these files will be required
const pkeyPath = path.resolve(__dirname, '../../config/','private_key.pem'); // these files will be required
const policyPath = path.resolve(__dirname,'../../config/','cfront_cookie_policy.json'); // these files will be required

let jwks: GetKeyFunction<jose.JWSHeaderParameters, jose.FlattenedJWSInput>; // GetKeyFunction
const privateKey = readFileSync(pkeyPath,{encoding:"utf8"}); // .pem
const policy = readFileSync(policyPath,{encoding:"utf8"}); // COULD/should be generated per user/item/resource


// required set up
try{
    let webKeySet:jose.JSONWebKeySet;
    webKeySet = JSON.parse(readFileSync(jwksJSON,{encoding:"utf8"}))
    jwks = jose.createLocalJWKSet(webKeySet);
} catch (err){
    log("error with the jwks file");
    throw err; // we're going to consider this fatal and process no more
}

// module.exports = maketime;
router.use(maketime,verifyJWT);

// we will include this as a final middleware for logging
function maketime(req:any,res:any,next:any){
        // tslint:disable-next-line:no-console
        console.log('ReqMade At:', Date.now())
        next()
    }


// just for testing our protected routes
router.get('*', (req, res, next) => {
    // assuming we received a JWT in the header as 'Authorization: Bearer xxxxx'
    try{
        // // TODO: this is PART of the JWT verifying (that we have the header)
        // const jwt = splitBearer(req.header("Authorization"));
        // const { payload, protectedHeader } = await jose.jwtVerify(jwt, jwks, {
        //     issuer: process.env.AWS_ISSUER,
        //     audience: process.env.AWS_AUDIENCE,
        //   })

        // if issuer and audience is correct we should have a payload and header

        // log(payload,"PAYLOAD");
        // log(protectedHeader,"HEADER");

        // we get cookies that need to be append as Set-Cookie : value headers
        const cookies:CloudfrontSignedCookiesOutput = cookieMonster();

        // TODO: can't iterate signedCookiesOutput
        // can't use forin obj[key] because it's str,str,int,str ?
        // for( const [k,v] of Object.entries(cookies)){
            res.append("Set-Cookie",`CloudFront-Key-Pair-Id=${cookies["CloudFront-Key-Pair-Id"]}; Secure;Path=/;HttpOnly`);
            res.append("Set-Cookie",`CloudFront-Signature=${cookies["CloudFront-Signature"]}; Secure;Path=/;HttpOnly`);
            res.append("Set-Cookie",`CloudFront-Policy=${cookies["CloudFront-Policy"]}; Secure;Path=/;HttpOnly`);
        // }
        res.send(cookieMonster())

    }catch (err){
        next(err);
    }
})


// future middleware
// https://expressjs.com/en/guide/using-middleware.html
async function verifyJWT(req:any,res:any,next:any){ // TODO: fix these types?
    // TODO: error catching here also.
    try{
        const bearerHeader = req.header("Authorization");
        if(bearerHeader){
            const jwt = splitBearer(bearerHeader);
            // here we need to be returning a failed verification
            const { payload, protectedHeader } = await jose.jwtVerify(jwt, jwks, {
                issuer: process.env.AWS_ISSUER,
                audience: process.env.AWS_AUDIENCE,
              })
            next(); // pass control to the NEXT middleware
        } else{
            res.status(403).send("Bearer token required");
        }
    }catch(err){
        log(err.name);
        log({"error":err.name,"value":err.value},"JWT VERIFY ERROR");
        res.status(400).send(err.name);
    }
}


// this is happy path code
function splitBearer(bearer:string){
    const bear = bearer.split(' ');
    const bearerToken = bear[1];
    return bearerToken
}


function cookieMonster(){
    // TODO: make middleware
    const cloudfrontDistributionDomain = process.env.AWS_CFRONT_DOMAIN;
    // const s3ObjectKey = "private-content/*";
    // const s3ObjectKey = "public-content/*";


    const s3ObjectKey = "*"; // no separation of public/private atm.
    const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;// no s3 key we use *
    const keyPairId =  process.env.AWS_KEY_PAIR;  // public key ID
    const dateLessThan = "2023-01-01"; // we're setting this manually while we develop

    const cookies = getSignedCookies({
    url,
    keyPairId,
    privateKey,
    policy
    });

    return cookies

}


function log(param:any,pre?:string){
    if(pre){
            // tslint:disable-next-line:no-console
        console.log(`####\n${pre}\n####`)
    // tslint:disable-next-line:no-console
        console.log(param)
    }else{
    // tslint:disable-next-line:no-console
        console.log(param);
    }
}


export default router

// https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-setting-signed-cookie-custom-policy.html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_cloudfront_signer.html#getsignedcookies
