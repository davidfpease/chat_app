import React from 'react';
import { Link } from 'react-router-dom';  
import ChatWindow from './chat_window.js'; 
import { io }  from "socket.io-client";


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //socket: io('http://localhost:5000'),
    }
    this.socket = io();
    //debugger;
    this.logoutUser = this.logoutUser.bind(this);
    
  }

  componentDidMount(){
    // let socket = io();
    // this.setState({
    //   socket: socket
    // });
    
    // this.socket.on('connect', () => {
    //   console.log("Connection made client side");
    // })
    // socket.emit("join server", this.props.currentUser.id);
  }

  logoutUser(e) {
    e.preventDefault();
    this.props.logout();
  }

  render() {
    let messages = [];
    let members = [];
    
    
   
    //dynamically create rooms and assign names based on curretn User enrollments
    return (
      <div>
        <h1>Hello From the Dashboard</h1>
        <ChatWindow socket={this.socket} roomName="general" messages={messages} members={members} currentUser={this.props.currentUser}/>
        <ChatWindow socket={this.socket} roomName="random" messages={messages} members={members} currentUser={this.props.currentUser}/>

      </div>
    );
  }
}

export default Dashboard;