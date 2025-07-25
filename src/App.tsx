import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/queryClient';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <h1 className="text-3xl font-bold underline text-amber-300">
        Hello world!
      </h1>
      <ToastContainer stacked limit={5} position="bottom-right" />
    </QueryClientProvider>
  )
}

export default App