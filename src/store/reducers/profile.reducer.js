import axios from "axios";
import cookies from 'react-cookies'

// Initial state
const PROFILE_STATE = {
    profile: null,
}
const url = process.env.REACT_APP_URL

// Reducer
export default (state = PROFILE_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'EDIT_PROFILE':
            return { ...state, updatedProfile: payload };
        case 'GET_PROFILE':
            return { ...state, profile: payload };
        case 'UPLOAD':
            return { ...state, images: payload };
        default:
            return state;
    }
}

export const profileEdit = (payload) => async dispatch => {
    try {
        if (!payload.email) {
            const obj = {
                name: payload.name,
                Date_Of_Birth: payload.Date_Of_Birth,
                phone: payload.phone,
            }
            const token = cookies.load('user_session');
            const response = await axios.patch(`${url}profile`, obj, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(profile(response.status));
        } else {
            const token = cookies.load('user_session');
            const response = await axios.patch(`${url}profile`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(profile(response.status));
        }
    } catch (error) {
        if (error.response) {
            // dispatch(profile(error.response.data));
            dispatch(profile(error.response.status));
        } else if (error.request) {
            console.error('No response from the server:', error.request);
        } else {
            console.error('Error while making the request:', error.message);
        }
    }
}

export const getProfile = () => async dispatch => {
    try {
        const token = cookies.load('user_session');
        if (!token) {
            console.log('invalid token');
            return;
        }
        const response = await axios.get(`${url}profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(getMyProfile(response.data));
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};


export const uploadImage = (image) => async dispatch => {
    const token = cookies.load('user_session');
    const formData = new FormData();
    formData.append('image', image)
    await axios.post(`${url}profileImage`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        .then(res => {
            dispatch(upload(res.data))
        })
}


export const uploadHero = (image) => async dispatch => {
    const token = cookies.load('user_session');
    const formData = new FormData();
    formData.append('image', image)
    await axios.post(`${url}heroImage`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        .then(res => {
            dispatch(upload(res.data))
        })
}


export const profile = (user) => ({
    type: 'EDIT_PROFILE',
    payload: user
});


export const getMyProfile = (user) => ({
    type: 'GET_PROFILE',
    payload: user
});

export const upload = (user) => ({
    type: 'UPLOAD',
    payload: user
});

