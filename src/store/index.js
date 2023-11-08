import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/user.reducer'
import dealsReducer from './reducers/deals.reducer'
import profileReducer from './reducers/profile.reducer'
const store = configureStore({
    reducer: {
        user: userReducer,
        deals: dealsReducer,
        profile: profileReducer
    }
});

export default store;