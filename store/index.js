import {configureStore} from "@reduxjs/toolkit";
import {userDataSlice} from "./userDataSlice";
import {formStatusSlice} from "./formStatusSlice";
import {appStateSlice} from "./appStateSlice"

const store = configureStore ({
    reducer: {
        userData: userDataSlice.reducer,
        formStatus: formStatusSlice.reducer,
        appState: appStateSlice.reducer,
    }
})

export default store;