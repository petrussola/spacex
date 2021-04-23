import React from "react";
import { Box, Text, Button } from "@chakra-ui/core";

import { formatDateTime } from "../utils/format-date";

export default function HistoryCard({ data }) {
  const redirectHandler = (link) => {
    window.location.href = link;
  };
  return (
    <Box
      boxShadow="md"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      m="0 auto"
      width="50%"
      p={6}
    >
      <Box
        color="gray.500"
        fontWeight="semibold"
        letterSpacing="wide"
        fontSize="lg"
        textTransform="uppercase"
        width="100%"
      >
        {data.title}
      </Box>
      <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
        {formatDateTime(data.event_date_utc)}
      </Box>
      <Text color="gray.700" fontSize={["md", null, "lg"]} my="8">
        {data.details}
      </Text>
      <Box
        display="flex"
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Text>Links: </Text>
        {Object.keys(data.links).map((key) => {
          if (data.links[key]) {
            return (
              <Button
                ml="1rem"
                onClick={() => redirectHandler(data.links[key])}
                rounded="md"
                bg="tomato"
                color="white"
              >
                {key[0].toUpperCase() + key.slice(1, key.length)}
              </Button>
            );
          }
          return null;
        })}
      </Box>
    </Box>
  );
}
