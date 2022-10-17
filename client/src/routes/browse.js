
import React from 'react';
import { Outlet } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
// import { Comment } from '../components/Comment';
import Comment from "../components/Comment";
import SearchForm from '../components/SearchForm';


export default function Browse() {
  const [items, setItems] = React.useState(null); //call getBrowseData and populate state
  const [currentItem, setCurrentItem] = React.useState(null) // set when we click through to view an item

  const getBrowseData = async () => {
    const url = "/api/browse"
    const resp = await fetch(url); //promise
    const json = await resp.json() //json 
    setItems(json.Items) //-> array
  }

  React.useEffect(() => {
    document.title = "Browse"
    getBrowseData(); //baaaaad we need to stop this happening every time you click an item

  }, [currentItem]);


  let itemsBox = []

  if (items) {
    items.map(function (item, index) {
      itemsBox = [...itemsBox, <li><ItemCard {...item} onClick={() => setCurrentItem(item)}></ItemCard></li>]
    })
  }


  if (!currentItem) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <div id="search">
          <SearchForm />
        </div>
        <h2>Many Items can be browsed</h2>
        <div id="browselist">
          <ul>
            {itemsBox}
          </ul>
        </div>
      </main>
    );
  } else {
    return (
      <main style={{ padding: "1rem 0" }}>

        <h2>A single Item can be commented on</h2>
        <ItemCard {...currentItem}></ItemCard>
        <Comment {...currentItem} onClick={() => setCurrentItem(null)}>submit comment</Comment>
      </main>
    );
  }
}

