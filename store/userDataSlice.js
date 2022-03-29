import {createSlice} from "@reduxjs/toolkit";

const userDataInitialState = {
    userDataLoaded: false,
    bggUserName: null,
    games: null,
    selectedGameData: null,
    settings: {
        displayGameTitles: false,
        collectionFilters:  {
            own: true,
            prevowned: false,
            fortrade: false,
            want: false,
            wanttoplay: false,
            wanttobuy: false,
            wishlist: false,
            preordered: false,
        }
    }
}

const userDataSlice = createSlice({
    name: 'userData',
    initialState: userDataInitialState,
    reducers: {
        setBggUserName(state, action) {
            state.bggUserName = action.payload
        },
        loadGameCollectionData(state, action) {
            state.games = action.payload
        },
        resetGameCollection(state, action) {
            state.games = null
        },
        confirmDataLoaded(state, action) {
            state.userDataLoaded = true
        },
        loadSelectedGameData(state, action) {
            state.selectedGameData = action.payload
        },
        resetSelectedGameData(state, action) {
            state.selectedGameData = null
        },
        displayGameTitlesOn(state, action) {
            state.settings.displayGameTitles = true
        },
        displayGameTitlesOff(state, action) {
            state.settings.displayGameTitles = false
        },
        toggleCollectionFilter(state, action){
            state.settings.collectionFilters[action.payload] = !state.settings.collectionFilters[action.payload]
        },
    }
})
export const userDataActions = userDataSlice.actions;
export {userDataSlice}