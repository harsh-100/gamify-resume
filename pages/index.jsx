import Head from "next/head";
import dynamic from "next/dynamic";

const GameMount = dynamic(() => import("@/game/GameMount"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Harsh&apos;s Dev Quest</title>
      </Head>
      <main>
        <GameMount />
      </main>
    </>
  );
}
