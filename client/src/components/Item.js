import React from 'react';
import Comment from './Comment';

export class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
            title: 'Title',
            version: 0,
            fileID: 1,
            description: 'This is a description',
            createdAt: 'createdAt',
            url: 'https://via.placeholder.com/300x300',
        };
    }

    componentDidMount() {
        document.title = 'title'

    }

    componentWillUnmount() {

    }

    handleCommentClick() {

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

        if (this.state.isActive) {
            commentDiv = <Comment fileID={this.state.fileID} onClick={this.handleHide}></Comment>
        } else {
            commentDiv = <button onClick={this.handleShow}>Update Description</button>
        }

        return (
            <div className="Item" style={{ border: '2px solid', width: "80%", height: "100%" }} >
                <>
                    {this.state.fileID === 1 &&
                        <><div className="Item-Title">
                            <h3>{this.state.title} </h3>
                        </div><div className="Item-image" style={{ border: '2px dashed' }}>
                                <img className="comment" style={{ width: "80%", height: "60%" }} src={'https://via.placeholder.com/300'} alt={this.state.title} width="150" height="150"></img>
                            </div><div className="Item-description" style={{ border: '2px solid' }}>
                                <p>{this.state.description}</p>
                            </div><div className="data" style={{ border: '2px solid' }}>
                                {commentDiv}
                            </div></>}
                    <br></br>
                </>
            </div>
        );
    }
}

