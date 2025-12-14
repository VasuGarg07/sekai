import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from "react-redux";
import { RouterProvider } from 'react-router';
import router from './Router';
import { queryClient } from './shared/queryClient';
import { store } from './store/store';
import { useAuthListener } from './hooks/useAuthListener';
import { ModalProvider } from './ui/ModalContext';
import { ToastProvider } from './ui/ToastProvider';

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
          <ToastProvider>
            {/* Sync Firebase -> Redux state */}
            <AuthSync />
            <ModalProvider>
              <RouterProvider router={router} />
            </ModalProvider>
          </ToastProvider>
        </Provider>
      </QueryClientProvider>
    </>
  )
}

export default App;