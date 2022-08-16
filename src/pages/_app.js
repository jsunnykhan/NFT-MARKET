import StateContextProvider from "../components/StateContex";
import "../styles/globals.css";
import Layout from "./layout";

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
