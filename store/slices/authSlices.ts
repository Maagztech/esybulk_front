import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ToastAndroid } from 'react-native';

// User Interface
interface User {
    id: string;
    name: string;
    email: string;
    type: string;
    companyName?: string;
    designation?: string;
    companyAddress?: string;
}

// Auth State Interface
interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

// Initial State
const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { phone: number; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://esybulk.com/api/login', credentials); // Replace with your API endpoint
            return response?.data;
        } catch (error: any) {
            ToastAndroid.show('Login failed, try again.', ToastAndroid.SHORT);
            return rejectWithValue(error?.response?.data || 'Login failed');
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (credentials: { name: string; companyName: string; designation: string; companyAddress: string; phone: number; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://esybulk.com/api/signup', credentials); // Replace with your API endpoint
            return response?.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || 'Signup failed');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
                state.isAuthenticated = true;
                state.user = action?.payload?.user;
                state.token = action?.payload?.token;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action?.payload || 'Something went wrong';
            })
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
                state.isAuthenticated = true;
                state.user = action?.payload?.user;
                state.token = action?.payload?.token;
                state.loading = false;
            })
            .addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action?.payload || 'Signup failed';
            });
    },
});

// Export actions
export const { logout, setToken, } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
