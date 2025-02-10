import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './redux/app/store.js';
import App from './App';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App/>
        <ToastContainer position='top-center' autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Provider>
);
