import {createSlice} from "@reduxjs/toolkit";

const appStateInitialState = {
    sideBarOpen: false,
    infoBoxOpen: false,
}

const appStateSlice = createSlice({
    name: 'appState',
    initialState: appStateInitialState,
    reducers: {
        openSideBar(state, action) {
            state.sideBarOpen = true;
        },
        closeSideBar(state, action) {
            state.sideBarOpen = false;
        },
        openInfoBox(state, action) {
            state.infoBoxOpen = true;
        },
        closeInfoBox(state, action) {
            state.infoBoxOpen = false;
        },
    }
})
export const appStateActions = appStateSlice.actions;
export {appStateSlice}