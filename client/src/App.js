import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


/** import all components */
import Username from './components/Username';
import Password from './components/Password';
import Dashboard from './components/dashboard';
import Register from './components/Register';
import Teamshifts from './components/teamshifts';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import Worklogs from './components/Worklogs';
import PageNotFound from './components/PageNotFound';

//import  Worklogs  from '../../server/controllers/jirapiController';
//import Plans from '../../server/controllers/teamsapiController';

/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'


/** root routes */
const router = createBrowserRouter([
    {
        path : '/userboard',
        element : <Dashboard></Dashboard>
    },
    {
        path : '/shifts',
        element : <Teamshifts></Teamshifts>
    },
    {
        path : '/',
        element : <Username></Username>
    },
    {
        path : '/register',
        element : <Register></Register>
    },
    {
        path : '/password',
        element : <ProtectRoute><Password /></ProtectRoute>
    },
    {
        path : '/profile',
        element : <AuthorizeUser><Profile /></AuthorizeUser>
    },
    {
        path : '/recovery',
        element : <Recovery></Recovery>
    },
    {
        path : '/reset',
        element : <Reset></Reset>
    },
    {
        path : '/workflow',
        element :<Worklogs></Worklogs>
    },
  // do not forget to add worklogs and plans paths here
    {
        path : '*',
        element : <PageNotFound></PageNotFound>
    },

   
])

export default function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
  )
}
