import React from "react";
import { Box, IconButton, Progress, Tooltip } from "@chakra-ui/core";

export default function Timeline({ countItem, changeItem, data }) {
  const dateObj = new Date(data[countItem].event_date_utc);
  const year = dateObj.getFullYear();
  return (
    <>
      <Box
        display="flex"
        direction="center"
        justifyContent="center"
        color="gray.500"
        fontWeight="semibold"
        letterSpacing="wide"
        fontSize="lg"
        width="100%"
      >
        {year}
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        height="2rem"
        padding="2rem"
      >
        <Tooltip
          label={countItem !== 0 ? "Click to go back in time" : null}
          placement="bottom"
        >
          <IconButton
            icon="arrow-left"
            width="10%"
            variant="ghost"
            onClick={() => changeItem("down")}
            isDisabled={countItem === 0}
            variantColor="white"
            outline="none"
            _focus={{
              boxShadow: "none",
            }}
          />
        </Tooltip>
        <Progress
          value={(countItem / (data.length - 1)) * 100}
          size="sm"
          width="100%"
        />
        <Tooltip
          label={countItem !== 0 ? "Click to advance in time" : null}
          placement="bottom"
        >
          <IconButton
            icon="arrow-right"
            width="10%"
            variant="ghost"
            onClick={() => changeItem("up")}
            isDisabled={countItem === data.length - 1}
            variantColor="white"
            outline="none"
            _focus={{
              boxShadow: "none",
            }}
          />
        </Tooltip>
      </Box>
    </>
  );
}
