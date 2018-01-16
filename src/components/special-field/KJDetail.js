"use strict";

import React from "react";

class KJDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  render() {
    return (
      <div className="brainstorming-field">
        <div className="title">
          <div className="logo" id="KJ" />
          <div className="line" />
          <label className="text">收斂法(KJ法)</label>
        </div>
        <div className="exit" />
        <div className="left-field">
          <img className="img" src="./img/kj_img.png" />
          <div className="text">遊戲簡介：運用歸納的原理，將具相同屬性、關聯性的想法放在一起，並思索出索引標題，找出想法的脈絡，最後依據歸納的結果，找出相對應的結論。</div>
        </div>
        <div className="right-field">
          <div className="instruction">
            <label className="type">時機</label>
            <div className="line"></div>
            <ul className="list">
              <li>有太多的想法不知道該如何整合</li>
              <li>對於難以理出頭緒的事情進行歸納整理時</li>
            </ul>
          </div>
          <div className="instruction">
            <label className="type">應用範圍</label>
            <div className="line"></div>
            <ul className="list">
              <li>歸納想法</li>
              <li>整理思維</li>
            </ul>
          </div>
        </div>
        <div className="bottom-field">
          <div className="button">開始遊戲</div>
          <div className="button">看教學</div>
        </div>
      </div>
    )
  }
}


export default KJDetail