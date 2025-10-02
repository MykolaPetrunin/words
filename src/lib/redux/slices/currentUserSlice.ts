import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { ApiUser } from '@/lib/types/user';

export interface CurrentUserState {
    user: ApiUser | null;
    loading: boolean;
}

const initialState: CurrentUserState = {
    user: null,
    loading: false
};

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setUser(state, action: PayloadAction<ApiUser | null>) {
            state.user = action.payload;
        }
    }
});

export const { setLoading, setUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
