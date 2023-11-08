import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from '../signup'
import Signin from '../login'
import ForgotPassword from '../login/resetPassword/forgetPassword'
import ResetPassword from '../login/resetPassword/resetPassword'
import NotFound from '../404'
import NonAuthHome from '../NonAuth/NonAuthHome'

function Container() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<SignUp />} />
                <Route path="/signin" element={<Signin />} />
                <Route path='/forgetPassword' element={<ForgotPassword />} />
                <Route path='/resetPassword/:id' element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    )
}

export default Container
