"use strict";

import React from "react";
import { connect } from "react-redux";
import socket from "../../socket";
import {
    setAgenda,
    newAgenda,
    deleteAgenda,
    updateAgenda,
    doneAgenda,
    showAdvice
} from "../../actions/Actions";

// import{   Button  }from 'react-native';



import {render} from 'react-dom';
// import Input from 'react-bootstrap/lib/Input.js';
import EagleButton from "./eagleButton";

// import {Button} from 'react';

//import { identifier } from "../../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/babel-types";

class Agenda extends React.Component {
    constructor(props) { 
        super(props);

        this.state ={
            advice:"",
            // adviceContainer:false
        };
    

        // this.state = {
        //     agendaList: [
        //         {
        //             content: "", //單個議程內容
        //             isAgendaFinished: false //議程是否完成，會觸發checkbox是否被選取&是否有刪除縣
        //         }
        //     ]
        // };
        this.onClick_ToggleDeleteAgenda = this.onClick_ToggleDeleteAgenda.bind(
            this
        );
        //this.onClick_ToggleAddAgenda = this.onClick_ToggleAddAgenda.bind(this);
        //this.handleAgendaInputPressEnter = this.handleAgendaInputPressEnter.bind(this);
    }

    componentWillMount() {}

    componentDidMount() {
        this.scrollToBottom();
        socket.on('receiveDBStatus',(DBstatus)=>{
            if(DBstatus.DBstatus==="成功"){
                // echo "send sussess ";
            }else{
                // echo "sebd fail";
            }
            
        })
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    onClick_ToggleDeleteAgenda(e) {
        let key = parseInt(e.target.id, 10);
        // this.setState({
        //     ...this.state,
        //     agendaList: [
        //         ...this.state.agendaList.slice(0, key),
        //         ...this.state.agendaList.slice(key + 1)
        //     ]
        // });
        this.props.dispatch(deleteAgenda(key));
        socket.emit("deleteAgenda", key);
    }

    // onClick_showAdvice(){
    //     this.props.dispatch(showAdvice());
    // }

    // showAdvice(){
    //     this.setState({
    //         adviceContainer:!this.state.adviceContainer
    //     });
    // }

    onChange_advice(e){
        this.setState({ advice: e.target.value });
    }

    onClick_adviceSend(){
        // state {advice}
        // let adviceText = "advice_input"
        socket.emit('sendFeedback',{
            'msg' : this.state.advice ,
            'creat_at' : date
        })
        
        // this.props.dispatch(adviceText());
    }

    onClick_newAgenda(e) {
        let key = "agenda_input" + this.props.agendaList.length;

        this.props.dispatch(newAgenda());
        socket.emit("newAgenda");
    }

    onChangeInput(e) {
        let key = parseInt(e.target.id, 10);
        //取得現在時間
        let date = new Date();
        //自定義時間格式:Hour-Minute
        let formattedTime = `${date.getHours()}:${(date.getMinutes() < 10 ? "0" : "")}${date.getMinutes()}:${date.getSeconds()}`
 
        this.props.dispatch(
            updateAgenda({
                key: key,
                value: e.target.value,
                time: formattedTime
            })
        );
        socket.emit("updateAgenda", {
            key: key,
            value: e.target.value,
            time: formattedTime
        });
    }




    onClick_Enter(e) {
        if (e.keyCode == 13) {
            e.target.blur();
        }
    }

    onClick_toggleAgendaFinish(e) {
        let key = parseInt(e.target.id, 10);
        //取得現在時間
        let date = new Date();
        //自定義時間格式:Hour-Minute
        let formattedTime = `${date.getHours()}:${(date.getMinutes() < 10 ? "0" : "")}${date.getMinutes()}:${date.getSeconds()}`
        this.props.dispatch(doneAgenda(key, formattedTime));
        socket.emit("doneAgenda", key, formattedTime);
    }

    scrollToBottom() {
        const node = this.messagesEnd;
        node.scrollIntoView({ behavior: "smooth" });
    }

    render() {
        let agendaDetail;
      // var hoverAdviceC="hoverAdvice";
        // var adviceSendC="adviceSend";

        // if(this.state.adviceContainer){
        //     hoverAdviceC
        // }
  
// advice button begins        
        // let adviceButton = (

    <EagleButton click={this.selectClick} 
    needConfirm={this.state.needConfirm}>
                 <div className="showAdvice">
        <img  className="eagle" src="img/eagle.png" 
            onClick={ ()=> {
                this.showAdvice(); }
            }
                />
            
            <div className="adviceContainer" >
        
                <input className="hoverAdvice"    
                onChange={e => {
                    this.onChange_advice(e);
                }}
                value={this.state.advice}
                placeholder="請輸入你的advice"
                />    
            
                <div
                    className="adviceSend"
                    // ref = { "dvice_input" + advice}
                    // style={
                    //     this.props.adviceList[advice].isNull
                    //         ? {}
                    //         :  {
                            
                    //         }
                    // }


                    onClick={ () => {
                        this.onClick_adviceSend();
                    }}
                >                            
                    SEND
                </div> 
            </div>     
        </div> 


        <button type="button" name="新增" 
            className="btn" 
            onClick={this.selectConfirm}>
                {/* confirm 後this拿掉  */}
                傳送
        </button> 
    </EagleButton>

       
    // );
// advice button ends




        if (this.props.agendaList.length > 0) {
            agendaDetail = this.props.agendaList.map(item => {
                let key = this.props.agendaList.indexOf(item);
                return (
                    <div className="detail">
                        <div className="checkbox">
                            <img
                                style={
                                    this.props.agendaList[key].isAgendaFinished
                                        ? { animation: "fadeIn 0.4s" }
                                        : {}
                                }
                                className="checked"
                                id={key}
                                onClick={e => {
                                    if (this.props.agendaList[key].content) {
                                        this.onClick_toggleAgendaFinish(e);
                                    }
                                }}
                                src={
                                    this.props.agendaList[key].isAgendaFinished
                                        ? "./img/tick.png"
                                        : "./img/null.png"
                                }
                            />
                        </div>
                        <input
                            className="text"
                            style={
                                this.props.agendaList[key].isAgendaFinished
                                    ? {
                                          textDecoration: "line-through",
                                          background: "transparent"
                                      }
                                    : {}
                            }
                            ref={"agenda_input" + key}
                            id={key}
                            value={this.props.agendaList[key].content}
                            onChange={e => {
                                this.onChangeInput(e);
                            }}
                            onKeyUp={e => {
                                this.onClick_Enter(e);
                            }}
                            maxLength="10"
                            readOnly={
                                this.props.agendaList[key].isAgendaFinished
                                    ? "readonly"
                                    : ""
                            }
                            placeholder="點此輸入議程內容"
                        />

                        
                          <input
                            className="text"
                            // ref =
                            // className="t    ext"
                            type="text"
                            
                        />
                   {/* <input
                        
                            ref="userName"
                            className="indexinput"
                            type="text"
                            placeholder="請輸入你的名字"
                            onChange={e => {
                                this.onChange_userName(e);
                            }}
                        /> */}

                        <div
                            className="delete"
                            id={key}
                            onClick={e => {
                                this.onClick_ToggleDeleteAgenda(e);
                            }}
                        />
                    </div>
                );
            });
        }

        return (
            <div className="agenda-block">
                <img className="branch" src="img/branch.gif" />
                <EagleButton />
                
                {/* selectClick後 this拿掉 */}


{/* <div className="eagleButton"
    onClick={e => {
        this.onClick_showAdvice();
    }}
> */}
   

               
                


            {/*  顯示的advice button 不是eagle button */}

{/*                 
                <div className="EEagle"  
                style={{ right:'0px' }}   > 
                    <img className="eagle" src="img/eagle.png" />
                </div> */}
                
                 
                  {/* vs */}
                {/* <div>{adviceButton}</div> */}
                {/* <div className="eagleHover">
???????????????????????????

                <EagleButton />
                

                <div className="eagleButton"
                    onClick={e => {
                        this.onClick_showAdvice();
                    }}
                >
                    <img  className="eagle" src="img/eagle.png" />
                    
                    {/* <div className="adviceBar"> */}
                        {/* <input className="hoverAdvice"    
                        onChange={e => {
                            this.onChange_advice(e);
                        }}
                        value={this.state.advice}
                        placeholder="請輸入你的advice"
                        />     */}
                    
                        {/* <div
                            className="adviceSend"
                            // ref = { "dvice_input" + advice}
                            // style={
                            //     this.props.adviceList[advice].isNull
                            //         ? {}
                            //         :  {
                                    
                            //         }
                            // }


                            onClick={ () => {
                                this.onClick_adviceSend();
                            }}
                        >    
 ?????????????????????????????????                          
                            這是一張圖片
                        </div> */}
                    
                   
                    {/* </div> */}
                {/* </div>  */}


                {/* </div> */}

                <div className="flag">
                    <div className="bar" />
                    <div className="left" />
                    <div className="right" />
                    <div className="agenda-title">議程</div>
                    <div className="agenda-content">
                        {agendaDetail}
                        <div
                            style={{ float: "left", clear: "both" }}
                            ref={el => {
                                this.messagesEnd = el;
                            }}
                        />
                    </div>

                    {/* <input
                            className="text"
                            ref =
                            className="t    ext"
                            type="text"
                            
                    /> */}

                    <div
                        className="agenda-add"
                        onClick={e => {
                            this.onClick_newAgenda(e);
                        }}
                    >
                        <div className="cross" />
                        <div className="text" unselectable="on">
                            增加議程
                        </div>

                        {/* <eagleButton /> */}
                        1

                    </div>
                    
                  

                </div>
                3
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        agendaList: state.agenda,
        // adviceList: state.advice
    };
};

export default connect(mapStateToProps)(Agenda);
