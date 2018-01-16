"use strict";
import {
    setReservationDetailState,
    setPaintOpen,
    setSixhatDetailOpen,
    setGridDetailOpen,
    setVotingDetailState
} from "../../actions/Actions";
/*******************
 * 語音助理種類
 * Type1. 新增類型- 投票、議程、預約會議 
 * Type2. 開啟類型- 電子白板、腦力激盪、視訊、音訊、共享螢幕
 * Type3. 複製網址
 * Type4. 偵測語音辨識，對其提供建議
 * *****************/
let Assistant = {
    useAssistant: (recognition_result,Meeting,closeAll) => {
        //console.log("開始語音助理功能");
        let InputText = recognition_result; //語音辨識中間或結果的文字要傳進來這裡
        let text_flag = false; //當遇到動詞要true
        let text_site = 0;
        let text_type = 0;
        let Input_Verb = [
            ["建立", "開設", "設立", "創建", "新增", "增加"], //Type1: 新增類型
            ["開始", "使用"], //Type2: 開起類型
            ["複製", "邀請"] //Type3: 複製網址
        ];
        // Step1. 尋找句子的動詞
        for (
            let whichword = 0;
            whichword <= InputText.length + 2;
            whichword++
        ) {
            let word = InputText.slice(whichword, whichword + 2);
            // console.log(word); 測試用
            //建立投票
            if (
                word == "建立" ||
                word == "開設" ||
                word == "設立" ||
                word == "創建" ||
                word == "新增" ||
                word == "增加"
            ) {
                text_flag = true;
                text_site = whichword;
                text_type = 1;
                console.log("Step1-1_建立");
                break;
            } else if (
                word == "開始" ||
                word == "使用" ||
                word == "開啟" ||
                word == "玩"
            ) {
                text_flag = true;
                text_site = whichword;
                text_type = 2;
                console.log("Step1-2_開始");
                break;
            } else if (word == "複製" || word == "邀請") {
                text_flag = true;
                text_site = whichword;
                text_type = 3;
                console.log("Step1-3_複製");
                break;
            }
        }

        // Step2. 根據類型對應相對的方法
        if (text_flag) {
            switch (text_type) {
                case 1:
                    AddEvent(text_site);
                    break;
                case 2:
                    OpenEvent(text_site);
                    break;
                case 3:
                    CopyEvent(text_site);
                    break;
            }
        }

        // Step3. 執行該指定方法
        function AddEvent(text_site) {
            for (
                let whichword = text_site;
                whichword <= text_site + 4;
                whichword++
            ) {
                let word = InputText.slice(whichword, whichword + 2);
                if (word == "投票") {
                    closeAll()
                    Meeting.props.dispatch(setVotingDetailState(true))
                    //開啟Toolbar.js的 Meeting.props.votingDetail.isVotingStart
                    console.log("開啟投票畫面!");
                    break;
                } else if (word == "議程") {
                    //省略不做
                    console.log("新增議程!");
                    break;
                } else if (word == "預約") {
                    closeAll()
                    Meeting.props.dispatch(setReservationDetailState(true))
                    //開啟Toolbar.js的 this.state.isRerservationOpen
                    console.log("開啟預約會議畫面");
                    break;
                } else {
                    console.log("step3-1_notmatch");
                }
            }
        }

        function OpenEvent(text_site) {
            for (
                let whichword = text_site;
                whichword <= text_site + 8;
                whichword++
            ) {
                let word = InputText.slice(whichword, whichword + 2);
                if (word == "電子白板" || word == "白板" || word == "畫板") {
                    closeAll()
                    Meeting.props.dispatch(setPaintOpen())
                    //開啟Meeting.js 的 Meeting.props.isPaintOpen
                    console.log("開啟電子白板!");
                    break;
                } else if (word == "六頂") {
                    closeAll()
                    Meeting.props.dispatch(setSixhatDetailOpen())
                    //開啟MainScreen.js 的 Meeting.props.isSixhatOpen
                    console.log("開啟六頂思考帽遊戲!");
                    break;
                } else if (word == "九宮" || word == "發散") {
                    closeAll()
                    Meeting.props.dispatch(setGridDetailOpen())
                    //開啟Meeting.js 的 Meeting.props.isGridOpen
                    console.log("開啟九宮格遊戲!");
                    break;
                } else {
                    console.log("step3-2_notmatch");
                }
            }
        }

        function CopyEvent(text_site) {
            for (
                let whichword = text_site;
                whichword <= text_site + 6;
                whichword++
            ) {
                let word = InputText.slice(whichword, whichword + 2);
                if (word == "網址" || word == "他人" || word == "別人") {
                    //開啟Toolbar.js 的 this.state.isAddUserOpen
                    console.log("複製網址囉!");
                    break;
                } else {
                    console.log("step3-3_notmatch");
                }
            }
        }

        return InputText;
    }
};

module.exports = Assistant;
