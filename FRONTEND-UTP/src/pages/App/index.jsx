import { useRoutes, BrowserRouter } from 'react-router-dom'

import Home from '../Home'
import Navbar from './../../components/Navbar'
import '../../index.css'

const AppRoutes = () => {
    return useRoutes([
        {path: '/', element: <Home name='Logo' />},
        {path: '/general', element: <Home name='General' />},
        {path: '/dash', element: <Home name='Dashboard' />},
        {path: '/config', element: <Home name='Config' />},
    ])
}

let App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <AppRoutes />
        </BrowserRouter>
    )
}

export default App
