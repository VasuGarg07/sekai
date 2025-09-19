import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from "react-redux";
import { RouterProvider } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from './Router';
import { queryClient } from './shared/queryClient';
import { store } from './store/store';
import { useAuthListener } from './hooks/useAuthListener';

function AuthSync() {
  // A small helper component to run useAuthListener once
  useAuthListener();
  return null;
}

const App = () => {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {/* Sync Firebase -> Redux state */}
          <AuthSync />
          <RouterProvider router={router} />
        </Provider>
      </QueryClientProvider>
      <ToastContainer stacked limit={5} position="bottom-right" />
    </>
  )
}

export default App