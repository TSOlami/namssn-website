/* eslint-disable no-unused-vars */
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';

// Your PrivateRoute component

const PrivateRoutes = ({ children }) => {
  const isCookieSet = Cookies.get('jwt');
  console.log(Cookies.get('jwt'));
  console.log(isCookieSet? "Cookie is set" : "Cookie is not set");
  const { userInfo } = useSelector(state => state.auth);
  return userInfo ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoutes;
