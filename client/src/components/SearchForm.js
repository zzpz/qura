import React from "react";

const SearchForm = (props) => {
    

    const onClick = (event) => {
        event.preventDefault();
        console.log("you searched!");

    }

    return(
    <form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search"
                placeholder= {props.placeholder}
                type="search"
                name="q"
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={true}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
<button type="submit" onClick={onClick}>Search</button>
            </form>
    )
}
export default SearchForm;