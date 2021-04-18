import React, { useState } from "react";
import {
  Badge,
  Box,
  Image,
  SimpleGrid,
  Text,
  Flex,
  IconButton,
} from "@chakra-ui/core";
import { format as timeAgo } from "timeago.js";
import { Link } from "react-router-dom";
import { MdStar, MdStarBorder } from "react-icons/md";

import { useSpaceXPaginated } from "../utils/use-space-x";
import { formatDate } from "../utils/format-date";
import Error from "./error";
import Breadcrumbs from "./breadcrumbs";
import LoadMoreButton from "./load-more-button";

const PAGE_SIZE = 12;

export default function Launches() {
  const { data, error, isValidating, setSize, size } = useSpaceXPaginated(
    "/launches/past",
    {
      limit: PAGE_SIZE,
      order: "desc",
      sort: "launch_date_utc",
    }
  );
  console.log(data, error);
  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Launches" }]}
      />
      <SimpleGrid m={[2, null, 6]} minChildWidth="350px" spacing="4">
        {error && <Error />}
        {data &&
          data
            .flat()
            .map((launch) => (
              <LaunchItem launch={launch} key={launch.flight_number} />
            ))}
      </SimpleGrid>
      <LoadMoreButton
        loadMore={() => setSize(size + 1)}
        data={data}
        pageSize={PAGE_SIZE}
        isLoadingMore={isValidating}
      />
    </div>
  );
}

export function LaunchItem({ launch }) {
  const [isFaved, setIsFaved] = useState(false);

  const addFav = (e) => {
    e.preventDefault();
    setIsFaved((isFaved) => !isFaved);
  };
  return (
    <Box
      as={Link}
      to={`/launches/${launch.flight_number.toString()}`}
      boxShadow="md"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      position="relative"
    >
      <Image
        src={
          launch.links.flickr_images[0]?.replace("_o.jpg", "_z.jpg") ??
          launch.links.mission_patch_small
        }
        alt={`${launch.mission_name} launch`}
        height={["200px", null, "300px"]}
        width="100%"
        objectFit="cover"
        objectPosition="bottom"
      />

      <Image
        position="absolute"
        top="5"
        right="5"
        src={launch.links.mission_patch_small}
        height="75px"
        objectFit="contain"
        objectPosition="bottom"
      />

      <Box p="6">
        <Box d="flex" alignItems="center">
          {launch.launch_success ? (
            <Badge px="2" variant="solid" variantColor="green">
              Successful
            </Badge>
          ) : (
            <Badge px="2" variant="solid" variantColor="red">
              Failed
            </Badge>
          )}
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
            width="100%"
          >
            {launch.rocket.rocket_name} &bull; {launch.launch_site.site_name}
          </Box>
          <IconButton
            d="flex"
            justifyContent="flex-end"
            aria-label="Add to favorites"
            icon={isFaved ? MdStar : MdStarBorder}
            variant="ghost"
            variantColor="white"
            color="yellow.400"
            fontSize="2rem"
            onClick={(e) => addFav(e)}
            outline="none"
            _focus={{
              boxShadow: "none",
            }}
          />
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {launch.mission_name}
        </Box>
        <Flex>
          <Text fontSize="sm">{formatDate(launch.launch_date_utc)} </Text>
          <Text color="gray.500" ml="2" fontSize="sm">
            {timeAgo(launch.launch_date_utc)}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
