import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {};

export const thunkGetAllInventory = () => async (dispatch: any) => {
    const response = await fetch("http://localhost:8000/api/inventory/");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }
        dispatch(inventorySlice.actions.setInventory(data));
        return data
    }
};

export const thunkAddInventory = (item: {}) => async (dispatch: any) => {
    const response = await fetch(`http://localhost:8000/api/inventory/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
    })
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }
        dispatch(inventorySlice.actions.addItem(data));
        return data
    }
};

export const thunkUpdateInventory = (id: number, item: {}) => async (dispatch: any) => {
    const response = await fetch(`http://localhost:8000/api/inventory/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
    })
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }
        dispatch(inventorySlice.actions.updateItem(data));
        return data
    }
};

export const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        setInventory: (state, action: PayloadAction) => {
            state.items = action.payload
        },
        addItem: (state, action: PayloadAction) => {
            const items = (state.items ? [...state.items] : [])
            items.push(action.payload)
            state.items = items
        },
        updateItem: (state, action: PayloadAction) => {
            const items = (state.items ? [...state.items] : [])
            const item: any = action.payload
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === item.id) {
                    items[i] = item
                }
            }
            state.items = items
        }
    }
});

export const { setInventory } = inventorySlice.actions;
export const inventoryReducer = inventorySlice.reducer;