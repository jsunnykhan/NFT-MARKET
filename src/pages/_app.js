import Head from "next/head";
import StateContextProvider from "../components/StateContex";
import "../styles/globals.css";
import Layout from "./layout";

function MyApp({ Component, pageProps }) {
  return (
    <StateContextProvider>
      <Layout>
        <div >
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <link rel="shortcut icon" href="/Logo-reverse.png" />
          </Head>
          <Component {...pageProps} />
        </div>
      </Layout>
    </StateContextProvider>
  );
}

export default MyApp;
