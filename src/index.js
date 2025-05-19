import React from 'react';
import ReactDOM from 'react-dom/client';
import './index00.scss';
import App from './App';
import {RouterProvider} from 'react-router-dom'
import router from '@/router';
import '@ant-design/v5-patch-for-react-19'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}></RouterProvider>
);
