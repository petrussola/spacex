import React, { useEffect, useState } from "react";
import { Flex, Box, IconButton, Progress, Icon } from "@chakra-ui/core";

import { useSpaceX } from "../utils/use-space-x";

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
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      height="2rem"
      padding="2rem"
    >
      <IconButton
        icon="arrow-left"
        width="10%"
        variant="ghost"
        onClick={() => changeItem("down")}
        isDisabled={countItem === 0}
      />
      <Progress
        value={((countItem + 1) / data.length) * 100}
        size="lg"
        width="100%"
      />
      <IconButton
        icon="arrow-right"
        width="10%"
        variant="ghost"
        onClick={() => changeItem("up")}
        isDisabled={countItem === data.length - 1}
      />
    </Box>
  );

  //   return (
  //     <Flex direction="column" align="center" justify="center">
  //       <Box>{JSON.stringify(data[countItem])}</Box>
  //       <Flex
  //         direction="row"
  //         align="center"
  //         justify="space-between"
  //         width="100vw"
  //         // height="300px"
  //       >
  //         {/* <IconButton></IconButton> */}
  //         <Progress value={60} bg="red" color="green"/>
  //         {/* <IconButton></IconButton> */}
  //       </Flex>
  //     </Flex>
  //   );
}
