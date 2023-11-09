
import cookies from 'react-cookies';
import CryptoJS from 'crypto-js';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const USER_STATE = {
  user: []
}
const url = process.env.REACT_APP_URL


export default (state = USER_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case 'SIGN_IN':
      cookies.save('user_session', payload.token)
      const dataToEncrypt = JSON.stringify(payload)
      cookies.save('id', payload.id)
      const secretKey = process.env.SECRETKEY || 'kafana'
      const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, secretKey).toString();
      cookies.save('user', encryptedData)
      return { state, user: { ...payload, isLogged: true } }
    case 'USER_DATA':
      const decodedData = CryptoJS.AES.decrypt(payload, 'kafana').toString(CryptoJS.enc.Utf8)
      return { user: JSON.parse(decodedData) }
    case 'LOG_OUT':
      cookies.remove('user_session')
      cookies.remove('user')
      return { ...state, user: { isLogged: false } }
    case 'id':
      return { ...state, user: payload }
    case 'ALL_USERS':
      return { ...state, allUsers: payload }
    case 'UPDATE_USERS':
      return { ...state, updatedUser: payload }
    case "ALL_CLAIMED":
      return { ...state, allClaimed: payload }
    case 'ONE_USERS':
      return { ...state, oneUser: payload }
    default:
      return state
  }
}


export const getUser = () => async dispatch => {
  try {
    const token = cookies.load('user_session');
    if (!token) {
      console.log('invalid token');
      return;
    }
    const response = await axios.get(`${url}users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getUsers(response.data));
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
}

export const getOneUser = (id) => async dispatch => {
  try {
    const token = cookies.load('user_session');
    if (!token) {
      console.log('invalid token');
      return;
    }
    const response = await axios.get(`${url}users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getoneUsers(response.data));
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
}

export const updateUser = (obj, id) => async dispatch => {
  try {
    const token = cookies.load('user_session');
    const response = await axios.patch(`${url}user/${id}`, obj, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    dispatch(updateUsers(response.data));
  } catch (error) {
    if (error.response) {
      // dispatch(profile(error.response.data));
      dispatch(updateUsers(error.response.status));
    } else if (error.request) {
      console.error('No response from the server:', error.request);
    } else {
      console.error('Error while making the request:', error.message);
    }
  }
}

export const deleteUser = (array) => async dispatch => {
  try {
    const token = cookies.load('user_session');
    if (!token) {
      console.log('invalid token');
      return;
    }

    const data = {
      userID: array
    };

    await axios.delete(`${url}user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
  } catch (error) {
    console.error('Error deleting users:', error);
  }
}


export const deleteDeal = (array) => async dispatch => {
  try {
    const token = cookies.load('user_session');
    if (!token) {
      console.log('invalid token');
      return;
    }
    const data = {
      userID: array
    };

    await axios.delete(`${url}/deals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
  } catch (error) {
    console.error('Error deleting users:', error);
  }
}

export const allClaimed = () => async dispatch => {
  try {
    const token = cookies.load('user_session');
    const response = await axios.get(`${url}allclaimed`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    dispatch(getClaim(response.data));
  } catch (error) {
    if (error.response) {
      // dispatch(profile(error.response.data));
      dispatch(getClaim(error.response.status));
    } else if (error.request) {
      console.error('No response from the server:', error.request);
    } else {
      console.error('Error while making the request:', error.message);
    }
  }
}

export const logOut = () => ({
  type: "LOG_OUT",
});

export const signin = (user) => ({
  type: "SIGN_IN",
  payload: user,
});

export const id = (id) => ({
  type: "id",
  payload: id,
});

export const uderData = (user) => ({
  type: "USER_DATA",
  payload: user,
});

export const DecodeToken = () => ({
  type: 'DECODE_TOKEN'
})

export const getUsers = (users) => ({
  type: "ALL_USERS",
  payload: users,
})

export const getoneUsers = (user) => ({
  type: "ONE_USERS",
  payload: user,
})

export const getClaim = (users) => ({
  type: "ALL_CLAIMED",
  payload: users,
})

export const updateUsers = (users) => ({
  type: "UPDATE_USERS",
  payload: users,
})

