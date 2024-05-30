import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {};

interface Quote {
    customer_first_name: string,
    customer_last_name: string,
    customer_email: string,
    text: string,
    total_price: number
}

export const thunkGetAllQuotes = () => async (dispatch: any) => {
    const response = await fetch(`http://localhost:8000/api/quotes/`);
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }
        dispatch(listSlice.actions.setQuotes(data));
        return data
    }
};

export const thunkCreateQuote = (quote: Quote) => async (dispatch: any) => {
    const response = await fetch(`http://localhost:8000/api/quotes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quote)
    })
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }
        dispatch(listSlice.actions.addQuote(data));
        return data
    }
};

export const listSlice = createSlice({
    name: "list",
    initialState,
    reducers: {
        setQuotes: (state, action: PayloadAction) => {
            state.quotes = action.payload
        },
        addQuote: (state, action: PayloadAction) => {
            const quotes = (state.quotes ? [...state.quotes] : [])
            quotes.push(action.payload)
            state.quotes = quotes
        }
    },
});

export const { setQuotes, addQuote } = listSlice.actions;
export const quoteReducer = listSlice.reducer;