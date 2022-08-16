import Head from "next/head";
import Home from "../features/Home";

export default function index() {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <Home />
    </div>
  );
}
