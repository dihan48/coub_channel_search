import Head from "next/head";
import { Form } from "../components/form";
import { Feed } from "../components/feed";

import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Coub Channel Search</title>
        <meta name="description" content="Coub Channel Search" />
        <meta name="viewport" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Form />
        <Feed />
      </main>
    </>
  );
}
