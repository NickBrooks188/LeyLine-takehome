import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {};

export const thunkGetSettlement = () => async (dispatch: any) => {
    const response = await fetch("http://localhost:8000/api/settlements");
    if (response.ok) {
        const data = await response.json();
        if (data.error) {
            return;
        }
        dispatch(settlementSlice.actions.setSettlement(data));
        return data
    }
};

export const thunkAddSettlement = (settlement: {}) => async (dispatch: any) => {
    const response = await fetch(`http://localhost:8000/api/settlements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settlement)
    })
    console.log(response)
    if (response.ok) {
        const data = await response.json();
        dispatch(settlementSlice.actions.setSettlement(data));
        return data
    } else {
        const data = await response.json();
        return data;
    }
};

export const thunkUpdateSettlement = (settlement: {}) => async (dispatch: any) => {
    const response = await fetch(`http://localhost:8000/api/settlements`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settlement)
    })
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return data;
        }
        dispatch(settlementSlice.actions.setSettlement(data));
        return data
    }
};

export const thunkDeleteSettlement = () => async (dispatch: any) => {
    const response = await fetch(`http://localhost:8000/api/settlements`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    if (response.ok) {
        const data = await response.json();
        if (data.error) {
            return data;
        }
        dispatch(settlementSlice.actions.setSettlement(undefined));
        return data
    }
};

export const settlementSlice = createSlice({
    name: "settlement",
    initialState,
    reducers: {
        setSettlement: (state, action: PayloadAction) => {
            state.data = action.payload
        }
    }
});

export const { setSettlement } = settlementSlice.actions;
export const settlementReducer = settlementSlice.reducer;