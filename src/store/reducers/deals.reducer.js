import axios from "axios"
import cookies from 'react-cookies'
const DEALS_STATE = {
    allDeals: []
}

const url = process.env.REACT_APP_URL

export default (state = DEALS_STATE, action) => {
    const { type, payload } = action
    switch (type) {
        case 'ALL_DEALS':
            return { ...state, allDeals: payload }
        case 'CLAIM_DEAL':
            return { ...state, claimed: payload }
        case 'GET_CLAIM_DEAL':
            return { ...state, getClaimed: payload }
        case 'REMOVE_CLAIM_DEAL':
            return { ...state, deleted: payload }
        case 'UPDATE_ONE_DEAL':
            return { ...state, updatedDeal: payload }
        case 'REMOVE_ONE_DEAL':
            return { ...state, deletedDeal: payload }
        default:
            return state;
    }
}

export const getDeals = () => async dispatch => {
    try {
        const token = cookies.load('user_session');
        if (!token) {
            console.log('invalid token');
            return;
        }
        const response = await axios.get(`${url}deals`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(deals(response.data));
    } catch (error) {
        console.error('Error fetching following:', error);
    }
};

export const claimDeal = (deal) => async dispatch => {
    try {
        const token = cookies.load('user_session');
        if (!token) {
            console.log('invalid token');
            return;
        }
        const obj = {
            Deal_ID: deal.id,
            Amount: deal.Amount,
            Currency: deal.Currency
        }
        const response = await axios.post(`${url}claim`, obj, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(claim(response.data));
    } catch (error) {
        console.error('Error fetching following:', error);
    }
};

export const getClaim = () => async dispatch => {
    try {
        const token = cookies.load('user_session');
        if (!token) {
            console.log('invalid token');
            return;
        }
        const response = await axios.get(`${url}claim`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(getClaimed(response.data));
    } catch (error) {
        console.error('Error fetching following:', error);
    }
};

export const getUserClaim = (id) => async dispatch => {
    try {
        const token = cookies.load('user_session');
        if (!token) {
            console.log('invalid token');
            return;
        }
        const response = await axios.get(`${url}claim/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(getClaimed(response.data));
    } catch (error) {
        console.error('Error fetching following:', error);
    }
};



export const removeClaim = (id) => async dispatch => {
    try {
        const response = await axios.delete(`${url}claim/${id}`);
        dispatch(removeClaimed(response.data));
    } catch (error) {
        console.error('Error fetching following:', error);
    }
};

export const updateDeal = (id, obj) => async dispatch => {
    try {
        const token = cookies.load('user_session');
        if (!token) {
            console.log('invalid token');
            return;
        }
        const response = await axios.patch(`${url}deal/${id}`, obj, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(updateOneDeal(response.data));
    } catch (error) {
        console.error('Error fetching :', error);
    }
};

export const removeDeal = (id) => async dispatch => {
    try {
        const token = cookies.load('user_session');
        if (!token) {
            console.log('invalid token');
            return;
        }
        const response = await axios.delete(`${url}deal/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(removeOneDeal(response.data));
    } catch (error) {
        console.error('Error fetching :', error);
    }
};


export const addDeal = (data) => async dispatch => {
    try {
        console.log(data);
        const token = cookies.load('user_session');
        const formData = new FormData();
        formData.append('image', data.image)
        formData.append('name', data.name)
        formData.append('Description', data.Description)
        formData.append('Amount', data.Amount)
        formData.append('Currency', data.Currency)
        await axios.post(`${url}deal`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                dispatch(deals(res.data))
            })
    } catch (e) {
        console.log(e.message);
    }
}
const deals = (deals) => ({
    type: 'ALL_DEALS',
    payload: deals
})


const claim = (claimed) => ({
    type: 'CLAIM_DEAL',
    payload: claimed
})

const getClaimed = (claimed) => ({
    type: 'GET_CLAIM_DEAL',
    payload: claimed
})
const removeClaimed = (remove) => ({
    type: 'REMOVE_CLAIM_DEAL',
    payload: remove
})

const updateOneDeal = (deal) => ({
    type: 'UPDATE_ONE_DEAL',
    payload: deal
})

const removeOneDeal = (deal) => ({
    type: 'REMOVE_ONE_DEAL',
    payload: deal
})