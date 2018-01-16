let isBrainStormingOpen = false

export default function brainStorming(state = isBrainStormingOpen, action) {
    switch (action.type) {
        case "setBrainStormingState":
            return state = action.data
        default:
            return state;
    }
}
