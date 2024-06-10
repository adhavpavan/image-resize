// pages/_app.js
import 'antd/dist/antd.css';
import '../styles/globals.css'; // if you have any other global styles
import App from 'next/app';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;