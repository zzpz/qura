import React from 'react';
import { Comment } from './Comment';

export class Item extends React.Component{
    constructor(props) {
        super(props);
        this.state = {   
        isActive: false,
        title:'title',
        version: 0,
        fileID: '',
        description: '',
        createdAt : 'createdAt',
url:'https://via.placeholder.com/150x150',
};
      }

      componentDidMount() {
        document.title = 'title'
        // this.timerID = setInterval(
        //     () => this.tick(),
        //     1000
        //   );
    }
  
    componentWillUnmount() {

    }

    handleCommentClick(){

    }

    handleShow = () => {
        this.setState({
          isActive: true
        });
      };
    
      handleHide = () => {
        this.setState({
          isActive: false
        });
      };

    


    render() {
        let commentDiv;

        if(this.state.isActive){
            commentDiv = <Comment fileID={this.state.fileID} onClick={this.handleHide}></Comment>
        }else{
            commentDiv = <button onClick={this.handleShow}>Update Description</button>
        }

        return (
            <div className = "Item" style = {{ border: '2px solid', width:"80%", height:"100%"}} >
                <div className = "Item-Title">
                    <h3>{this.state.title} </h3>
                </div>
                <div className = "Item-image" style = {{ border: '2px dashed'}}>
                    <img className ="comment" style = {{width: "80%", height: "60%"}} src={'https://project1-upload-files-bucket.s3.ap-south-1.amazonaws.com/'+this.state.fileID} alt={this.state.title} width="150" height="150"></img>
                </div>
                <div className = "Item-description" style = {{ border: '2px solid'}}>
                    <p>{this.state.description}</p>
                </div>
                <div className= "data" style = {{ border: '2px solid'}}>
                    {commentDiv}
                </div>
            </div>
        );
    }
}

