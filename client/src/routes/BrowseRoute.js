
import React from 'react';
import { Outlet } from 'react-router-dom';
import ItemCard from '../components/ItemCard';



export default function Browse(){
  const [items, setItems] = React.useState(null); //call getBrowseData and populate state
  const [currentItem, setCurrentItem] = React.useState(null) // set when we click through to view an item

  const getBrowseData = async () => {
    const url = "/api/browse"
    const resp = await fetch(url); //promise
    const json = await resp.json() //json 
    setItems(json.Items) //-> array
  }

  React.useEffect(() => {
    getBrowseData();
  }, []);


  let itemsBox = []

  if(items){
    items.map(function(item,index){
      itemsBox = [...itemsBox,<li><ItemCard {...item} onClick={()=>setCurrentItem(item)}></ItemCard></li>]
    })
  }


  if(!currentItem){
    return (
      <main style={{padding:"1rem 0"}}>
        <h2>Many Items</h2>
        <ul>
          {itemsBox}
        </ul>
      </main>
    );
  }else{
    return (
      <main style={{padding:"1rem 0"}}>
    <h2>ONE Item</h2>
    <ItemCard {...currentItem}></ItemCard>
    <button onClick={() => setCurrentItem(null)}>submit comment</button>
    <Outlet context={{currentItem}}></Outlet>
  </main>

    

    );
  }
}



// async function getBrowseData(optional){
//   return ({title:'title'})
//     // const url = "/api/browse"
   
//     // const resp = await fetch(url); //promise
//     // const json = await resp.json() //promise
//     // return json.Items
// }



