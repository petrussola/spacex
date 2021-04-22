import React, { useEffect, useState } from "react";

import { useSpaceX } from "../utils/use-space-x";
import Timeline from "./timeline";
import HistoryCard from "./history-card";
import Breadcrumbs from "./breadcrumbs";

export default function History() {
  const [countItem, setCountItem] = useState(0);
  const { data, error, isValidating, setSize, size } = useSpaceX(
    "/history",
    {}
  );
  console.log(data, error);

  useEffect(() => {
    localStorage.setItem("history_item", countItem.toString());
  }, []);

  const changeItem = (direction) => {
    if (direction === "up" && countItem < data.length) {
      setCountItem((countItem) => countItem + 1);
    } else if (direction === "down" && countItem > 0) {
      setCountItem((countItem) => countItem - 1);
    }
    return;
  };

  if (!data) {
    return <div>Loading</div>;
  }

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "SpaceX History" }]}
      />
      <Timeline countItem={countItem} changeItem={changeItem} data={data} />
      <HistoryCard data={data[countItem]} />
    </>
  );
}
