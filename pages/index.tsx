import React, { useEffect, useState } from "react";
import { List, Page } from "../components";

export default function StaticPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fetch('api/countries')
      .then((res) => res.json())
      .then(({ data }) => setRows(data));
  }, []);

  return (
    <Page title="Countries (Static)">
      <List rows={rows} />
    </Page>
  )
}
