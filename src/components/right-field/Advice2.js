"use strict";

import React from "react";
import { connect } from "react-redux";


// import {userGiveAdvice} from "../../actions/Actions";






export default class Advice extends React.Component{

    componentWillMount() { }

    componentDidMount() { }





    render(){
     
        // let ininput = styled.input`
        // font-size: 1.25em;
        // border: none;
        // background: papayawhip;
        // /* ...more styles here... */
        
        // &:hover {
        //     box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1);
        // }
        
        // @media (min-width: 650px) {
        //     font-size: 1.5em;
        // }
        // `;
    
        return(


           
            // {ininput}
            <div className="Advice">                 
                    


            <input className="adviceText"
                            
                // style={
                //     {
                //         padding: '5px 15px',
                //         border: '2px black solid',
                //         cursor:'pointer',
                //         // -webkit-border-radius: '5px',
                //         "border-radius": "5px" ,
                //         // 'font-size ': '50px',
                //         width: '150px',  /* 設定長與寬 */
	
                //         // height: '150px ',
                //         position: 'fixed',
                //         // 'display' : 'none',

                //         // 'background-image' : "url(" + '../../../public/img/eagle.png'+")"
                //         'background-image' :'url()'
                        
                //         // .class a{
                //           /* 平常設定不要顯示 */
	
                //         // 	}
                            
                //     	// :hover {
                //         //     di
                //         // } 
                            
                //         // 	display: block; 


                //     }
                // }
                // className="advice"
                    // type="text"
                 
                placeholder="請輸入你的advice"
                // onChange={e => {
                //     this.onChange_userName(e);
                // } }

            
            />

</div>
         )
     }


}



