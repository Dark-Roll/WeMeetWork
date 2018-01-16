const initialState = {
    isPaintOpen: false
};

export default function paint(state = initialState, action) {
    switch (action.type) {
        case "setPaintOpen":
            return Object.assign({}, state, { isPaintOpen: true });
        case "setPaintClose":
            return Object.assign({}, state, { isPaintOpen: false });
        default:
            return state;
    }
}
