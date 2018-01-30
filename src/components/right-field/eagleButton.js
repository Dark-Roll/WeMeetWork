"use strict";

import React,{Component} from 'react';
import {render} from 'react-dom';

export default class EagleButton extends Component{
  constructor(props){
      super(props);
      this.state = {
         clickProps:{
             display: 'none',  //控制display的值来隐藏与显示
             name:'show'
         }
      }
  }

  //组件的props发生改变,在组件接收到一个新的prop时被执行。这个方法在初始化render时不会被调用。
  componentWillReceiveProps(nextProps) {
        if(nextProps.needConfirm) {
             this.setState(
                  {
                     clickProps:{
                            display: 'none',
                            name:'show'
                     }
                 }
             );
         }
    }

/*
 *  'inline-block' == this.state.clickProps.display   条件：当前的state中display的值是否为 inline-block
 *   this.setState({clickProps:{display: 'none',name:'筛选'}})  值：  如果是，则隐藏div并在button上显示'筛选'
 *   this.setState({clickProps:{display: 'inline-block',name:'取消'}});  值：  如果不是，则显示div并在button上显示'取消'
*/
    changeDisplay() {
        'inline-block' == this.state.clickProps.display 
        ? 
            this.setState({
                clickProps:{display: 'none',name:'show'}
            }) 
        : 
            this.setState({
                clickProps:{display: 'inline-block',name:'cancel'}
            });
    this.props.click(this.state.clickProps.display);
    }

//this.props.children为这个按钮的子组件
  render(){
     return(


         <div className="box"         
       
        >
{/* ???????????????????????????? div ? 
    style={{'margin': '20'}} 
    style={{'display':'block','marginTop': '118'}} */}
                {/* <button 
                    // ref="tip" 
                    className="sendBtn"  
                    style={{
                        // 'z-index':'9' ,
                        'cursor': 'pointer'
                    }}          
                    
                    onClick={
                        this.changeDisplay.bind(this)
                    }
                >
                    確定
                    {this.state.clickProps.name}   
                  
                </button>        */}

                <img  className="eagle" src="img/eagle.png" 
                     
                    onClick={
                        this.changeDisplay.bind(this)
                    } 
                />

                <div className="filter-box" 
                    style={{
                        'display':this.state.clickProps.display
                    }}>
                     
                     {this.props.children}
                </div>
         </div>
     );
  }
}