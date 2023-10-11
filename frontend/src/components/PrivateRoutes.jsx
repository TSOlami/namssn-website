/* eslint-disable no-unused-vars */
import { useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';

// Your PrivateRoute component

const PrivateRoutes = ({ children }) => {
  const { userInfo } = useSelector(state => state.auth);
  return userInfo ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoutes;
