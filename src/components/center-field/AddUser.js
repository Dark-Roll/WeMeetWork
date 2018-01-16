"use strict";

import React from "react";

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      URL: window.location.href
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.copyRoomURLtoClipboard();
  }

  componentWillUnmount() {
  }

  copyRoomURLtoClipboard() {
    roomURL.select();
    document.execCommand('copy');
  }

  render() {
    return (
      <div className="adduser">
        會議網址<br />已複製到剪貼簿！
        <input id="roomURL" value={this.state.URL}></input>
      </div>
    );
  }
}

export default AddUser;
