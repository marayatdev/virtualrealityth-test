import { RouterProvider } from 'react-router-dom'
import router from './routes/AppRouter'
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

const App = () => {

  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe().catch(() => { });
  }, []);
  return <RouterProvider router={router} />
}

export default App