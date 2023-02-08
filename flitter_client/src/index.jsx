import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App';
import Home from "./pages/Home";
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import PageNotFound from "./pages/PageNotFound";

import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';

import { AuthContextProvider } from "./contexts/AuthContext";

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path=":author" element={
              <Home />
            } />
            <Route path='log-in' element={
              <PublicRoute>
                <LogIn />
              </PublicRoute>} />
            <Route path='sign-up' element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>} />
            <Route path="following" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
