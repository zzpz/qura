import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';



const ProtectedBrowse = () => {


    const client = axios.create({
    })

    const [imgSrc,setImgSrc] = useState(null);
    const [responseBad,setResponseBad] = useState(false);
    const getItem = () =>{

        client.get(
           "https://dyhn5p801r683.cloudfront.net/private/example_IMAGE.jpg",
           {
            withCredentials: true,
           }
        ).then( res => {console.log(res)});
}

const getItemNoCors = () =>{
    fetch('https://dyhn5p801r683.cloudfront.net/private/example_IMAGE.jpg', {
        'method': 'GET',
        'credentials': 'include',
        'mode': 'no-cors',
        'headers': {
            'accept': 'application/json, text/plain, */*', 'content-type': 'application/json'
        }
}).then(res =>{

    console.log(res.status);
    console.log(res);
    setImgSrc(res.data)
})
}


    useEffect( ()=>{


    },[responseBad])

    const showCookies =() => {
        const allCookies = document.cookie;
        console.log(allCookies)
    };
      
    const clearOutputCookies = () => {
        const output = Document.getElementById('cookies')
        output.textContent = ''
      };


      return(
        <main>
            <ul>
<li>
            <button onClick={getItem}>CORS issues prevents image</button>
            </li>
<li>        <button onClick={getItemNoCors}>No-Cors gives 403</button>
</li>     </ul>


    <div>
        <h3>This is where an img would be displayed if CORS worked</h3>
        <img src="https://dyhn5p801r683.cloudfront.net/private/example_IMAGE.jpg"></img>
        {imgSrc !==null? <img src={imgSrc}/>:null}
    </div>
    </main>
    )
}


export default ProtectedBrowse;