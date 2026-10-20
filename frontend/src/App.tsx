import { createBrowserRouter, RouterProvider } from 'react-router';
import { SessionProvider } from './features/questio/Providers';
import { Router } from './routers/Router';
import { ThemeProvider } from './components/ThemeProvider';
const router = createBrowserRouter([{ path: '*', element: <Router /> }]);
export default function App() {
  return <ThemeProvider><SessionProvider><RouterProvider router={router} /></SessionProvider></ThemeProvider>;
}
