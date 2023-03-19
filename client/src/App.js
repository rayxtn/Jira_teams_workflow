
import './components/WorklogComponent.js';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';


// IMPORTING ALL COMPONENTS
import WorklogComponent from './components/WorklogComponent';
import Username from './components/Username';
import Reset from './components/Reset';
import Register from './components/Register';
import Recovery from './components/Recovery';
import Profile from './components/Profile';
import Password from './components/Password';
import PageNotFound from './components/PageNotFound';


//ROUTE ROUTES
const router = createBrowserRouter([
  { path : '/',
    element : <Username></Username>
  },
  { path : '/register',
  element : <Register></Register>
},
{ path : '/Password',
  element : <Password></Password>
},
{ path : '/Profile',
  element : <Profile></Profile>
},
{ path : '/Reset',
  element : <Reset></Reset>
},
{ path : '/Recovery',
  element : <Recovery></Recovery>
},
{ path : '/Worklogs',
  element : <WorklogComponent></WorklogComponent>
},
{ path : '/*',
  element : <PageNotFound></PageNotFound>
},
]);


function App() {
  return (
    <main>
           <RouterProvider router={router}></RouterProvider>

    </main>
  );
}



export default App;

