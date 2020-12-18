import React, { Component } from 'react';
import  io  from "socket.io-client";


export default class ChatWindow extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: '',
      messages: {
        [props.roomName]: [],
      },
      members: [],
      message: {
        content: "",
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    //debugger;
  }
  

  //update text input field as user is typing
  handleChange(e){
    this.setState({
      message: {
        content: e.currentTarget.value,
      }
    })
  }

  componentDidMount() {
    //debugger;
    this.props.socket.emit("join room", this.props.roomName);
    this.props.socket.on("new message", payload =>{
      if(payload.chatName === this.props.roomName){
        let messages = this.state.messages[this.props.roomName].slice();  //create a new copy of messages
        messages.push(payload);
        debugger;
        this.setState({
          messages: {
            [this.props.roomName]: messages,
          }
        });
      }
      debugger;
    });
  }

  sendMessage() {
    const payload = {
      content: this.state.message.content,
      to: this.props.roomName,
      sender: this.props.currentUser.id,
      chatName: this.props.roomName,
      isChannel: true,
    };

    //send message back to server
    this.props.socket.emit("send message", payload);

    //empty the text field
    this.setState({
      message: {
        content: "",
      }
    })

  }
  
  
  render() {

    return (
      <div>
        <h3>Chat Window</h3>
        <p>Current user = {this.props.currentUser.id}</p>
        <form onSubmit={this.sendMessage}>
          <input type="text" value={this.state.message.content} 
            onChange={this.handleChange}></input>

        </form>
        <ul>
          {this.state.messages[this.props.roomName].map((msg, i) => (
            <li key={i}>{msg.sender} says: {msg.content}</li>
          ))}

        </ul>
      </div>
    )
  }
}
