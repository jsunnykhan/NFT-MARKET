import Head from "next/head";
import Home from "../features/Home.jsx";

export default function index() {
  return (
    <div className="">
      <Head>
        <title>Home</title>
      </Head>
      <div className="py-20">
        <Home />
      </div>
    </div>
  );
}
