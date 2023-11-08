import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/pages/home';
import Header from './components/Header';
import AdminHome from './components/pages/admin/Home'
import cookies from 'react-cookies';
import { decodeToken } from 'react-jwt';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Container from './components/pages/authContainer';
import NotFound from './components/pages/404';
import Profile from './components/pages/profileDashboard/Profile';
import Users from './components/pages/admin/Users';
import Claimed from './components/pages/admin/Claimed';
import AddDeal from './components/pages/addDeal';

function App() {
  const [decode, setDecode] = useState(null);
  const state = useSelector(state => state.user);
  const Logged = state.user.isLogged;
  const isAuth = cookies.load('user_session');

  useEffect(() => {
    if (isAuth) {
      const decodeAuth = decodeToken(isAuth);
      setDecode(decodeAuth);
    } else {
      setDecode(null);
    }
  }, [isAuth]);

  return (
    <div className="App">
      {decode && decode.userID ? (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            {
              decode && decode.role === 'admin' && (
                <>
                  <Route path="/deals" element={<AdminHome />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/claimed" element={<Claimed />} />
                </>
              )
            }
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      ) : (
        <Container />
      )}
    </div>
  );
}

export default App;
