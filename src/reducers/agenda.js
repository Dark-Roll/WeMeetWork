const agendaList = [
	{
		content: "", //單個議程內容
		isAgendaFinished: false, //議程是否完成，會觸發checkbox是否被選取&是否有刪除縣
		createTime:undefined,
		finishTime:undefined
	}
];

export default function agenda(state = agendaList, action) {
	switch (action.type) {
		case "setAgenda":
			return action.data;
		case "newAgenda":
			return [
				...state,
				{
					content: "",
					isAgendaFinished: false
				}
			];
		case "deleteAgenda":
			return [
				...state.slice(0, action.data),
				...state.slice(action.data + 1)
			];

		case "updateAgenda":
			return [
				...state.slice(0, action.data.key),
				{
					...state[action.data.key],
					content: action.data.value,
					createTime: action.data.time
				},
				...state.slice(action.data.key + 1)
			];
		case "doneAgenda":
			return [
				...state.slice(0, action.data),
				{
					...state[action.data],
					isAgendaFinished: !state[action.data].isAgendaFinished,
					finishTime:action.time
				},
				...state.slice(action.data + 1)
			];
		default:
			return state;
	}
}


{/* <HelloMessage style={{ color: '#FFFFFF', fontSize: '30px'}} /> */}

//     let Wrapper = styled.section` 
 
//     padding: 4em; 
   
//     background: papayawhip; 
   
//   `; 


// .more a{  /* 因為繼續閱讀是個超連結，要用a來定義 */

// 	display: none;  /* 平常設定不要顯示 */
	
// 	}
	
// 	.article:hover .more a{
	
// 	display: block;  /* 當滑鼠移至該篇文章時，設定以block顯示，可設定超連結以一個區塊顯示 */
	
// 	width: 150px;  /* 設定長與寬 */
	
// 	height: 150px;
	
// 	background: url(image url) center center no-repeat;  /* 設定背景 */
	
// 	position: absolute;  /* 將繼續閱讀的位置放置於文章左上角，top=0, left=0 */
	
// 	top: 0px;
	
// 	left: 0px;
	
// 	font-size: 0px;  /* 不要文字出現，因為設定背景來顯示 */
	
// 	}