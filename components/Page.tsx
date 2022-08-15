import React from "react";
import packageJSON from "../package.json";

type Props = {
  children: React.ReactNode;
  title?: string;
}

export default function Page({ children, title }: Props) {
  return (
    <>
      <header>
        <h1
          style={{
            textAlign: "center",
          }}
        >
          {title}
        </h1>
      </header>
      <main>{children}</main>
      <footer
        style={{
          backgroundColor: "white",
          textAlign: "center",
          position: "fixed",
          bottom: "0",
          width: "100%",
          padding: "10px 0"
        }}
      >
        <span>{packageJSON.version}</span>
      </footer>
    </>
  );
}