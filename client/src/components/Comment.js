import React from 'react';

export class Comment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {comment: "", fileID: props.fileID}
    }

    componentDidMount() {
        this.setState({loading:false})
        
    }


    hideLoading(){
        // console.log('hide loading')
    }

    _onChange = (event)=>{
        this.setState({[event.target.name]:event.target.value});
    }

    _createFormData(){
        var form_data = new FormData();
        for ( var key in this.state ) {
            form_data.append(key, this.state[key]);
        }        
        return form_data
    }

    _onError = (error) => {
        console.log('error')
        console.log(error)

    }
    _onSuccess = (data) => {
        console.log(data)
        alert("Success! Your comments have been added.")
        this.props.onClick()
    }

    _onSubmit= (event)=>{
        event.preventDefault()
        const form_data = this._createFormData()
        fetch('/api/comment',{
            method:'Post',
            body: form_data}
            )
            // .then((response) => {response.json()})
            .then((data) => {this._onSuccess(data)})
            .catch((error) => {this.onError(error)})
            .finally(this.hideLoading)
    }

    render(){
        return(
            <div className="form-container">
                <form ref='comment_form' onSubmit={this._onSubmit} >
                    <textarea name="comment" placeholder="Describe the item here" onChange={this._onChange} style={{width:"70%",height:"10%"}}></textarea>

                <input type="submit" value="Upload"  />
                </form> 
            </div>
        );
    }

};