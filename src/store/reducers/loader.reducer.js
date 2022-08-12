import { CHANGE_LOADER } from "../actions/loader.actions"

const initialState = {
    loading: true
}

const loaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_LOADER:
            return {
                ...state,
                [action.name]: action.value
            }
        default:
            return state;
    }
}

export default loaderReducer;