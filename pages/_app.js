import StateContextProvider from "../components/StateContex";
import "../styles/globals.css";
import Layout from "./layout";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function MyApp({ Component, pageProps }) {
  return (
    <StateContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StateContextProvider>
  );
}

export default MyApp;
