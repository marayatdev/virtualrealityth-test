
import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Info from '../pages/Info'
import EditProfile from '../pages/EditProfile'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/info',
        element: <Info />,
    },
    {
        path: '/info/edit',
        element: <EditProfile />,
    },
])

export default router