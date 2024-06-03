import './index.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import store, { persistor } from './Redux/Store'
import { PersistGate } from 'redux-persist/integration/react'
import Layout from './layout/Layout'
import Login from './components/Login/Login'
import 'react-toastify/dist/ReactToastify.css';
import Check from './Pages/Checkin.jsx'
import Home from "./components/Home/Home.jsx"
import Progress from './components/Progress/Progress.jsx'
import Admin from './Pages/Admin.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedAdmin from './components/ProtectedRouteForAdmin.jsx'
import { ForgotPassword } from './components/forgotPassword/forgotPassword.jsx'

import Attendance from './components/Attendance/Attendance.jsx'

import SingleLayout from './SingleLayout/SingleLayout.jsx'



function App() {


  return (
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor} >
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />}/>

              <Route path='/dashboard' element={<Layout />}>
                <Route path='' element={<ProtectedRoute ><Progress /></ProtectedRoute>} />
                <Route path='admin' element={<ProtectedRoute ><ProtectedAdmin ><Admin /></ProtectedAdmin></ProtectedRoute>} />
                <Route path='admin/attendance/:id' element={<ProtectedRoute ><ProtectedAdmin ><Attendance /></ProtectedAdmin></ProtectedRoute>} />
              </Route>

              <Route path='/login' element={<SingleLayout ><Login /></SingleLayout>} />
              <Route path='/checkin' element={<ProtectedRoute><SingleLayout ><Check /></SingleLayout></ProtectedRoute>} />
              <Route path='/forgotPassword' element={<SingleLayout ><ForgotPassword /></SingleLayout>} />



            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
  )
}

export default App;
