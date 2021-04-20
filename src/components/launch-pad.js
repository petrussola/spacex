import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Navigation } from "react-feather";
import {
  Flex,
  Heading,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Box,
  Text,
  Spinner,
  Stack,
  AspectRatioBox,
  IconButton,
} from "@chakra-ui/core";
import { MdStar, MdStarBorder } from "react-icons/md";

import { useSpaceX } from "../utils/use-space-x";
import Error from "./error";
import Breadcrumbs from "./breadcrumbs";
import { LaunchItem } from "./launches";

export default function LaunchPad({
  favePads,
  setFavePads,
  faveLaunches,
  setFaveLaunches,
}) {
  let { launchPadId } = useParams();

  const [isFaved, setIsFaved] = useState(false);

  const { data: launchPad, error } = useSpaceX(`/launchpads/${launchPadId}`);

  const { data: launches } = useSpaceX(launchPad ? "/launches/past" : null, {
    limit: 3,
    order: "desc",
    sort: "launch_date_utc",
    site_id: launchPad?.site_id,
  });

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
    const verdict = favePads.some((item) => {
      return item.site_id === launchPadId;
    });
    if (verdict) {
      setIsFaved(true);
    } else {
      setIsFaved(false);
    }
  }, [favePads, launchPadId]);

  if (error) return <Error />;
  if (!launchPad) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="50vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Launch Pads", to: ".." },
          { label: launchPad.name },
        ]}
      />
      <Header launchPad={launchPad} isFaved={isFaved} addFav={addFav} />
      <Box m={[3, 6]}>
        <LocationAndVehicles launchPad={launchPad} />
        <Text color="gray.700" fontSize={["md", null, "lg"]} my="8">
          {launchPad.details}
        </Text>
        <Map location={launchPad.location} />
        <RecentLaunches
          launches={launches}
          faveLaunches={faveLaunches}
          setFaveLaunches={setFaveLaunches}
        />
      </Box>
    </div>
  );
}

const randomColor = (start = 200, end = 250) =>
  `hsl(${start + end * Math.random()}, 80%, 90%)`;

function Header({ launchPad, isFaved, addFav }) {
  return (
    <Flex
      background={`linear-gradient(${randomColor()}, ${randomColor()})`}
      bgPos="center"
      bgSize="cover"
      bgRepeat="no-repeat"
      minHeight="15vh"
      position="relative"
      flexDirection={["column", "row"]}
      p={[2, 6]}
      alignItems="flex-end"
      justifyContent="space-between"
    >
      <Heading
        color="gray.900"
        display="inline"
        mx={[2, 4]}
        my="2"
        fontSize={["md", "3xl"]}
        borderRadius="lg"
      >
        {launchPad.site_name_long}
      </Heading>
      <Stack isInline spacing="3">
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
        <Badge variantColor="purple" fontSize={["sm", "md"]}>
          {launchPad.successful_launches}/{launchPad.attempted_launches}{" "}
          successful
        </Badge>
        {launchPad.stats === "active" ? (
          <Badge variantColor="green" fontSize={["sm", "md"]}>
            Active
          </Badge>
        ) : (
          <Badge variantColor="red" fontSize={["sm", "md"]}>
            Retired
          </Badge>
        )}
      </Stack>
    </Flex>
  );
}

function LocationAndVehicles({ launchPad }) {
  return (
    <SimpleGrid columns={[1, 1, 2]} borderWidth="1px" p="4" borderRadius="md">
      <Stat>
        <StatLabel display="flex">
          <Box as={MapPin} width="1em" />{" "}
          <Box ml="2" as="span">
            Location
          </Box>
        </StatLabel>
        <StatNumber fontSize="xl">{launchPad.location.name}</StatNumber>
        <StatHelpText>{launchPad.location.region}</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel display="flex">
          <Box as={Navigation} width="1em" />{" "}
          <Box ml="2" as="span">
            Vehicles
          </Box>
        </StatLabel>
        <StatNumber fontSize="xl">
          {launchPad.vehicles_launched.join(", ")}
        </StatNumber>
      </Stat>
    </SimpleGrid>
  );
}

function Map({ location }) {
  return (
    <AspectRatioBox ratio={16 / 5}>
      <Box
        as="iframe"
        src={`https://maps.google.com/maps?q=${location.latitude}, ${location.longitude}&z=15&output=embed`}
        alt="demo"
      />
    </AspectRatioBox>
  );
}

function RecentLaunches({ launches, faveLaunches, setFaveLaunches }) {
  if (!launches?.length) {
    return null;
  }
  return (
    <Stack my="8" spacing="3">
      <Text fontSize="xl" fontWeight="bold">
        Last launches
      </Text>
      <SimpleGrid minChildWidth="350px" spacing="4">
        {launches.map((launch) => (
          <LaunchItem
            launch={launch}
            key={launch.flight_number}
            faveLaunches={faveLaunches}
            setFaveLaunches={setFaveLaunches}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
