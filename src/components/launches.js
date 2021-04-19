import React, { useState, useEffect, useRef } from "react";
import {
  Badge,
  Box,
  Image,
  SimpleGrid,
  Text,
  Flex,
  IconButton,
  Button,
  useDisclosure,
} from "@chakra-ui/core";
import { format as timeAgo } from "timeago.js";
import { Link } from "react-router-dom";
import { MdStar, MdStarBorder } from "react-icons/md";

import { useSpaceXPaginated } from "../utils/use-space-x";
import { formatDate } from "../utils/format-date";
import Error from "./error";
import Breadcrumbs from "./breadcrumbs";
import LoadMoreButton from "./load-more-button";
import DrawerComponent from "./drawer";

const PAGE_SIZE = 12;

export default function Launches({
  faveLaunches,
  setFaveLaunches,
  favedItems,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const { data, error, isValidating, setSize, size } = useSpaceXPaginated(
    "/launches/past",
    {
      limit: PAGE_SIZE,
      order: "desc",
      sort: "launch_date_utc",
    }
  );
  console.log(data, error);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("favorites"));
    if (data) {
      setFaveLaunches(data);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(faveLaunches));
  }, [faveLaunches]);

  return (
    <div>
      <Box d="flex" justifyContent="space-between" alignItems="center">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Launches" }]}
        />
        <Button ref={btnRef} variantColor="teal" onClick={onOpen} mr="1.5rem">
          Favorites
        </Button>
      </Box>
      <SimpleGrid m={[2, null, 6]} minChildWidth="350px" spacing="4">
        {error && <Error />}
        {data &&
          data
            .flat()
            .map((launch) => (
              <LaunchItem
                launch={launch}
                key={launch.flight_number}
                faveLaunches={faveLaunches}
                setFaveLaunches={setFaveLaunches}
                favedItems={favedItems}
              />
            ))}
      </SimpleGrid>
      <LoadMoreButton
        loadMore={() => setSize(size + 1)}
        data={data}
        pageSize={PAGE_SIZE}
        isLoadingMore={isValidating}
      />
      <DrawerComponent
        isOpen={isOpen}
        onClose={onClose}
        btnRef={btnRef}
        faveLaunches={faveLaunches}
        setFaveLaunches={setFaveLaunches}
      />
    </div>
  );
}

export function LaunchItem({ launch, faveLaunches, setFaveLaunches }) {
  const [isFaved, setIsFaved] = useState(false);

  const addFav = (e) => {
    e.preventDefault();
    if (e.currentTarget.id === "Faving") {
      setIsFaved(true);
      setFaveLaunches([...faveLaunches, launch]);
    } else if (e.currentTarget.id === "Un-faving") {
      const data = faveLaunches.filter((item) => {
        return item.flight_number !== launch.flight_number;
      });
      setIsFaved(false);
      setFaveLaunches(data);
    }
  };

  useEffect(() => {
    const verdict = faveLaunches.some(
      (item) => item.flight_number === launch.flight_number
    );
    if (verdict) {
      setIsFaved(true);
    } else {
      setIsFaved(false);
    }
  }, [faveLaunches]);

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
            aria-label="Favorite Button"
            id={isFaved ? "Un-faving" : "Faving"}
            icon={isFaved ? MdStar : MdStarBorder}
            variant="unstyled"
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

// export function DrawerComponent({
//   isOpen,
//   onClose,
//   btnRef,
//   faveLaunches,
//   setFaveLaunches,
//   data,
// }) {
//   const location = useLocation();
//   const pageName = location.pathname.split("/")[1];

//   return (
//     <Drawer
//       isOpen={isOpen}
//       placement="right"
//       onClose={onClose}
//       finalFocusRef={btnRef}
//       scrollBehavior="inside"
//       size="md"
//     >
//       <DrawerOverlay />
//       <DrawerContent>
//         <DrawerCloseButton />
//         <DrawerHeader>{`Favorite ${pageName}`}</DrawerHeader>
//         <DrawerBody>
//           {faveLaunches.map((launch) => {
//             return (
//               <LaunchItem
//                 launch={launch}
//                 key={launch.flight_number}
//                 faveLaunches={faveLaunches}
//                 setFaveLaunches={setFaveLaunches}
//               />
//             );
//           })}
//         </DrawerBody>
//       </DrawerContent>
//     </Drawer>
//   );
// }
