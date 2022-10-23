import React, { useState } from 'react';


//TODO: complete rework of how data is passed, stored and handled.
//just moved from class to functional composition
const Comment = (props) => {

    const defaultValues = {
        comment: ""
    };

    const [commentValues,setcommentValues] = useState(defaultValues); //seems poor

    const _onError = (error) => {
        console.log('error')
        console.log(error)
        alert("there was an error");
        props.onClick()

    }
    const _onSuccess = (data) => {
        console.log(data)
        alert("Success! Your comments have been added.")
        props.onClick()
    }

    const _createFormData = () => {
        var form_data = new FormData();
        for ( var key in commentValues ) {
            form_data.append(key, commentValues[key]);
        }
        form_data.append("fileID",props.fileID) // REALLY BAD       
        console.log(form_data);
        return form_data
    }

    const _onSubmit= (event)=>{
        event.preventDefault()
        const form_data = _createFormData()
        fetch('/api/comment',{
            method:'Post',
            body: form_data}
            )
            // .then((response) => {response.json()})
            .then((data) => {_onSuccess(data)})
            .catch((error) => {_onError(error)})
            .finally(hideLoading)
    }

    const _onChange = (event)=>{
        setcommentValues({[event.target.name]:event.target.value}); //only works with a SINGLE comment text field
    }

    const hideLoading = () =>{
        // console.log('hide loading')
    }

    return(
            <div className="form-container">
                <br></br>
                <form  onSubmit={_onSubmit} >
                    <textarea name="comment" placeholder="Describe the item here" onChange={_onChange} style={{width:"70%",height:"10%"}}></textarea>
                </form> 
                <br></br>
                <button type="submit" onClick={_onSubmit}>Submit</button>
            </div>
        );
}

export default Comment;

// class previousClassbasedComponent extends React.Component{
//     constructor(props) {
//         super(props);
//         this.state = {comment: "", fileID: props.fileID}
//     }

//     componentDidMount() {
//         this.setState({loading:false})
        
//     }


//     hideLoading(){
//         // console.log('hide loading')
//     }

//     _onChange = (event)=>{
//         this.setState({[event.target.name]:event.target.value});
//     }

//     _createFormData(){
//         var form_data = new FormData();
//         for ( var key in this.state ) {
//             form_data.append(key, this.state[key]);
//         }        
//         return form_data
//     }

//     _onError = (error) => {
//         console.log('error')
//         console.log(error)

//     }
//     _onSuccess = (data) => {
//         console.log(data)
//         alert("Success! Your comments have been added.")
//         this.props.onClick()
//     }

//     _onSubmit= (event)=>{
//         event.preventDefault()
//         const form_data = this._createFormData()
//         fetch('/api/comment',{
//             method:'Post',
//             body: form_data}
//             )
//             // .then((response) => {response.json()})
//             .then((data) => {this._onSuccess(data)})
//             .catch((error) => {this.onError(error)})
//             .finally(this.hideLoading)
//     }

//     render(){
//         return(
//             <div className="form-container">
//                 <form ref='comment_form' onSubmit={this._onSubmit} >
//                     <textarea name="comment" placeholder="Describe the item here" onChange={this._onChange} style={{width:"70%",height:"10%"}}></textarea>

//                 <button type="submit" onClick={onClick}>Search</button>

//                 <input type="submit" value="Upload"  />
//                 </form> 
//             </div>
//         );
//     }

// };