import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from "react-redux";
import { RouterProvider } from 'react-router';
import router from './Router';
import { queryClient } from './shared/queryClient';
import { store } from './store/store';
import { useAuthListener } from './hooks/useAuthListener';
import { ToastProvider } from './ui/ToastProvider';

function AuthSync() {
  useAuthListener();
  return null;
}

const App = () => {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ToastProvider>
            <AuthSync />
            <RouterProvider router={router} />
          </ToastProvider>
        </Provider>
      </QueryClientProvider>
    </>
  )
}

export default App;