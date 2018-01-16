const initialVoteDetail = {
    isVotingStart: false,
    isVotingFinish: false,
    isVotingDetailOpen: false,
    isSelfSubmit: false,
    waitingForAnimate: false,
    isAnimateOpen: false,
    voting: {
        creator: "",
        secretOrNot: false,
        multiOrNot: [0],
        question: "",
        option: {
            option1: ""
        },
        createTime:""
    },
    result: {},
    history: []
};

export default function vote(state = initialVoteDetail, action) {
    switch (action.type) {
        case "setVotingDetail":
            if (action.data.restart) {
                return {
                    ...state,
                    isVotingStart: false,
                    isVotingFinish: false,
                    isSelfSubmit: false,
                    isVotingDetailOpen: true,
                    waitingForAnimate: false,
                    isAnimateOpen: false,
                    voting: action.data,
                    result: {}
                };
            } else {
                return Object.assign({}, state, { voting: action.data });
            }
        case "setVotingStart":
            return { 
                ...state,
                'voting': Object.assign(
                    {},
                    {...state.voting},
                    {'createTime':action.time}
                ),
                isVotingStart: true,
                isVotingDetailOpen: false
            }

        case "gotVoteFromServer":
            let sender = action.data.sender;
            let content = action.data.content;
            let newResult = {...state.result}
            content.map(chosenOption => {
                if (Object.keys(newResult).length > 0) {
                    if(Object.keys(newResult).includes(chosenOption)){
                        //就拿選票內容 > 在newResult裡面找到那個選項 > 加一
                        newResult[chosenOption].sum += 1
                        if (sender) {
                            newResult[chosenOption].voter.push(sender);
                        }
                    } else {
                        //新增這個選項 
                        newResult[chosenOption] = {
                            'sum': 1,
                            'voter': []
                        };
                        if (sender) {
                            newResult[chosenOption].voter.push(sender);
                        }
                    }
                } else {
                    //如果是第一個人投的
                    newResult[chosenOption] = {
                        'sum': 1,
                        'voter': []
                    };
                    if (sender) {
                        newResult[chosenOption].voter.push(sender);
                    }
                }
            });
            return Object.assign({}, state, { result: newResult });

        case "setAnimateOpen":
            return Object.assign({}, state, { isAnimateOpen: true });

        case "setAnimateClose":
            return Object.assign({}, state, { isAnimateOpen: false });

        case "setVotingFinish":
            return Object.assign({}, state, { isVotingFinish: true });

        case "waitingForAnimate":
            return {
                ...state,
                waitingForAnimate: true,
                history: [
                    ...state.history,
                    {
                        'vote': state.voting,
                        'result': state.result,
                        'finishTime': action.time
                    }
                ]
            };
        case "selfSubmitVote":
            return Object.assign({}, state, { isSelfSubmit: true });

        case 'setVotingDetailState':
            return Object.assign({}, state, { isVotingDetailOpen: action.data });

        default:
            return state;
    }
}
