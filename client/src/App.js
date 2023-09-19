import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
/** import all components */
import UserWithLoggedShifts from './components/UserWithLoggedShifts';
import Username from './components/Username';
import Password from './components/Password';
import Dashboard from './components/dashboard';
import Register from './components/Register';
import Teamshifts from './components/teamshifts';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import Worklogsdata from './components/worklogsdata';
import Worklogs from './components/Worklogs';
//testing
import PageNotFound from './components/PageNotFound';
import ShiftsByWeekComponent from './components/weekshifts';
import IssuesList from './components/issuesbyweek';
import Bonusdata from './components/bonusdata';
import UserData from './components/userdata';
//import  Worklogs  from '../../server/controllers/jirapiController';
//import Plans from '../../server/controllers/teamsapiController';

/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'


/** root routes */
const router = createBrowserRouter([
    {
        path : 'usersdata',
        element : <UserData></UserData>
    },
    {
        path : '/usersloggedshifts',
        element : <UserWithLoggedShifts></UserWithLoggedShifts>
    },
    {
        path : '/worklogsdata',
        element : <Worklogsdata></Worklogsdata>
    },
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
    {
        path:'/shiftbyweek',
        element: <ShiftsByWeekComponent></ShiftsByWeekComponent>
    },
    {
        path:'/issuesbyweek',
        element:<IssuesList></IssuesList>

    },  
    {
        path:'/bonusdata',
        element:<Bonusdata></Bonusdata>
    }
])

export default function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
  )
}
