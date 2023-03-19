import './App.css';
import './components/WorklogComponent.js';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';


// IMPORTING ALL COMPONENTS
import WorklogComponent from './components/WorklogComponent.js';
import username from './components/username';
import Reset from './components/Reset';
import Register from './components/Register';
import Recovery from './components/Recovery';
import Profile from './components/Profile';
import Password from './components/Password';
import PageNotFound from './components/PageNotFound';



//ROUTE ROUTES
const router = createBrowserRouter([
  { path : '/',
    element : <div>Root Route</div>
  },
  { path : '/register',
  element : <div>Register Route</div>
}
]);


function App() {
  return (
    <main>
           <RouterProvider router={router}></RouterProvider>

    </main>
  );
}



export default App;

