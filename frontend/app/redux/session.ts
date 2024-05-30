import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Credentials { [key: string]: string; }

// TODO: replace any
const initialState: any = {};

export const thunkAuthenticate = (token: string) => async (dispatch: any) => {
    const response = await fetch("http://localhost:8000/api/authenticate/", {
        method: "GET",
        headers: { "Authorization": `Token ${token}` }
    });
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }
        dispatch(sessionSlice.actions.setUser(data));
        return data
    }
};

export const thunkLogin = (credentials: object) => async (dispatch: any) => {
    const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(sessionSlice.actions.setUser(data));
        return data;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
};

export const thunkSignup = (user: object) => async (dispatch: any) => {
    const response = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(sessionSlice.actions.setUser(data));
        return data
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
};

export const thunkLogout = () => async (dispatch: any) => {
    const response = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }
        return data
    }
}

export const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setSessionState: (state, action: PayloadAction) => {
            state.sessionState = action.payload;
        },
        setUser: (state, action: PayloadAction) => {
            state.user = action.payload
        }
    },
});

export const { setSessionState, setUser } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;