import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Suspense } from "react";
import Main from "../components/Main.client";

export default function Home() {
  return (
    <div className={styles.container}>
      <Main></Main>
    </div>
  );
}
