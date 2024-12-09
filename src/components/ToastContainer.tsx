import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer as Container } from 'react-toastify';

const ToastContainer = () => {
  return (
    <Container
      className="left-1/2 -translate-x-1/2"
      position="top-center"
      autoClose={2000}
      pauseOnHover={false}
    />
  );
};

export default ToastContainer;
