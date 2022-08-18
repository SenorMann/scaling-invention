import React, { useEffect, useState } from "react";
import { List, Page } from "../components";

export default function StaticPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://achieved-purple-sidecar.glitch.me/countries')
      .then((res) => res.json())
      .then(({ data }) => setRows(data));
  }, []);

  return (
    <Page title="Countries (Static)">
      <List rows={rows} />
    </Page>
  )
}
