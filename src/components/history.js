import React, { useEffect, useState } from "react";
import { Button, Box } from "@chakra-ui/core";

import { useSpaceX } from "../utils/use-space-x";
import Timeline from "./timeline";
import HistoryCard from "./history-card";
import Breadcrumbs from "./breadcrumbs";

export default function History() {
  const [countItem, setCountItem] = useState(0);
  const { data, error } = useSpaceX("/history", {});
  console.log(data, error);

  useEffect(() => {
    const index = JSON.parse(localStorage.getItem("index-history"));
    setCountItem(index);
  }, []);

  useEffect(() => {
    localStorage.setItem("index-history", countItem);
  }, [countItem]);

  const changeItem = (direction) => {
    if (direction === "up" && countItem < data.length) {
      setCountItem((countItem) => countItem + 1);
    } else if (direction === "down" && countItem > 0) {
      setCountItem((countItem) => countItem - 1);
    }
    return;
  };

  const reset = () => {
    setCountItem(0);
  };

  if (!data) {
    return <div>Loading</div>;
  }

  return (
    <>
      <Box d="flex" justifyContent="space-between" alignItems="center">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "SpaceX History" }]}
        />
        <Button
          variantColor="teal"
          onClick={reset}
          mr="1.5rem"
          isDisabled={countItem === 0}
        >
          Go back to the start
        </Button>
      </Box>
      <Timeline countItem={countItem} changeItem={changeItem} data={data} />
      <HistoryCard data={data[countItem]} />
    </>
  );
}
