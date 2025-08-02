import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/queryClient';
import { RouterProvider } from 'react-router';
import router from './Router';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer stacked limit={5} position="bottom-right" />
    </QueryClientProvider>
  )
}

export default App