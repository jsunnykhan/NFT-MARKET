import Head from "next/head";
import Home from "../features/Home.jsx";

export default function index() {
  return (
    <div className=" bg-black">
      <Head>
        <title>Home</title>
      </Head>
      <div className="px-[5%] py-20 flex">
        <Home />
      </div>
    </div>
  );
}
