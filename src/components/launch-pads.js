import React, { useRef, useState, useEffect } from "react";
import {
  Badge,
  Box,
  SimpleGrid,
  Text,
  useDisclosure,
  IconButton,
  Button,
} from "@chakra-ui/core";
import { Link } from "react-router-dom";
import { MdStar, MdStarBorder, MdCancel } from "react-icons/md";

import Error from "./error";
import Breadcrumbs from "./breadcrumbs";
import LoadMoreButton from "./load-more-button";
import { useSpaceXPaginated } from "../utils/use-space-x";
import DrawerComponent from "./drawer";

const PAGE_SIZE = 12;

export default function LaunchPads({ favePads, setFavePads }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const { data, error, isValidating, size, setSize } = useSpaceXPaginated(
    "/launchpads",
    {
      limit: PAGE_SIZE,
    }
  );

  return (
    <div>
      <Box d="flex" justifyContent="space-between" alignItems="center">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Launch Pads" }]}
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
            .map((launchPad) => (
              <LaunchPadItem
                key={launchPad.site_id}
                launchPad={launchPad}
                favePads={favePads}
                setFavePads={setFavePads}
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
        favePads={favePads}
        setFavePads={setFavePads}
        listItems={favePads}
        setListItems={setFavePads}
      />
    </div>
  );
}

export function LaunchPadItem({ launchPad, favePads, setFavePads, isFavMenu }) {
  const [isFaved, setIsFaved] = useState(false);

  const addFav = (e) => {
    e.preventDefault();
    if (e.currentTarget.id === "Faving") {
      setIsFaved(true);
      setFavePads([...favePads, launchPad]);
    } else if (e.currentTarget.id === "Un-faving") {
      const data = favePads.filter((item) => {
        return item.site_id !== launchPad.site_id;
      });
      setIsFaved(false);
      setFavePads(data);
    }
  };

  useEffect(() => {
    const verdict = favePads.some((item) => item.site_id === launchPad.site_id);
    if (verdict) {
      setIsFaved(true);
    } else {
      setIsFaved(false);
    }
  }, [favePads, launchPad.site_id]);

  return (
    <Box
      as={Link}
      to={`/launch-pads/${launchPad.site_id}`}
      boxShadow="md"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      position="relative"
    >
      <Box p="6">
        <IconButton
          aria-label="Remove item from favorite list"
          icon={MdCancel}
          fontSize="2rem"
          position="absolute"
          top="0"
          right="0"
          bg="white"
          variantColor="white"
          color="red.600"
          visibility={isFavMenu ? "visible" : "hidden"}
          onClick={(e) => addFav(e)}
          id={isFaved ? "Un-faving" : "Faving"}
          zIndex={7}
          isRound={true}
        />
        <Box d="flex" alignItems="baseline">
          {launchPad.status === "active" ? (
            <Badge px="2" variant="solid" variantColor="green">
              Active
            </Badge>
          ) : (
            <Badge px="2" variant="solid" variantColor="red">
              Retired
            </Badge>
          )}
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {launchPad.attempted_launches} attempted &bull;{" "}
            {launchPad.successful_launches} succeeded
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
            visibility={isFavMenu ? "hidden" : "visible"}
          />
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {launchPad.name}
        </Box>
        <Text color="gray.500" fontSize="sm">
          {launchPad.vehicles_launched.join(", ")}
        </Text>
      </Box>
    </Box>
  );
}
