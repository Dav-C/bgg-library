import {createSlice} from "@reduxjs/toolkit";

const formStatusInitialState = {
    fetchStatus: '',
    fetchError: false,
    fetchErrorMessage: null,
    loading: false,
}

const formStatusSlice = createSlice({
    name: 'formStatus',
    initialState: formStatusInitialState,
    reducers: {
        fetchStart(state, action) {
            state.fetchStatus = 'fetching'
            state.loading = true
        },
        fetchComplete(state, action) {
            state.fetchStatus = 'complete'
            state.loading = false
            state.fetchAttemptCount = 0
        },
        fetchProcessing(state, action) {
            state.fetchStatus = 'processing'
            state.loading = true
        },
        fetchError(state, action) {
            state.loading = false
            state.fetchError = true
            state.fetchErrorMessage = action.payload
        },
        resetState(state, action) {
            state.fetchStatus= ''
            state.fetchError= false
            state.fetchErrorMessage= null
            state.loading= false
        }
    }
})
export const formStatusActions = formStatusSlice.actions;
export {formStatusSlice}