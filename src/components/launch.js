import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { format as timeAgo } from "timeago.js";
import { Watch, MapPin, Navigation, Layers } from "react-feather";
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
  Image,
  Link,
  Stack,
  AspectRatioBox,
  StatGroup,
  Tooltip,
  IconButton,
} from "@chakra-ui/core";
import { MdStar, MdStarBorder } from "react-icons/md";

import { useSpaceX } from "../utils/use-space-x";
import {
  formatDateTime,
  transformAmPm,
  checkDayPadTime,
} from "../utils/format-date";
import Error from "./error";
import Breadcrumbs from "./breadcrumbs";

export default function Launch({ faveLaunches, setFaveLaunches }) {
  let { launchId } = useParams();

  const [isFaved, setIsFaved] = useState(false);
  
  const { data: launch, error } = useSpaceX(`/launches/${launchId}`);

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
    const verdict = faveLaunches.some((item) => {
      return item.flight_number.toString() === launchId;
    });
    if (verdict) {
      setIsFaved(true);
    } else {
      setIsFaved(false);
    }
  }, [faveLaunches, launchId]);

  if (error) return <Error />;
  if (!launch) {
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
          { label: "Launches", to: ".." },
          { label: `#${launch.flight_number}` },
        ]}
      />
      <Header launch={launch} isFaved={isFaved} addFav={addFav} />
      <Box m={[3, 6]}>
        <TimeAndLocation launch={launch} />
        <RocketInfo launch={launch} />
        <Text color="gray.700" fontSize={["md", null, "lg"]} my="8">
          {launch.details}
        </Text>
        <Video launch={launch} />
        <Gallery images={launch.links.flickr_images} />
      </Box>
    </div>
  );
}

function Header({ launch, isFaved, addFav }) {
  return (
    <Flex
      bgImage={`url(${launch.links.flickr_images[0]})`}
      bgPos="center"
      bgSize="cover"
      bgRepeat="no-repeat"
      minHeight="30vh"
      position="relative"
      p={[2, 6]}
      alignItems="flex-end"
      justifyContent="space-between"
    >
      <Image
        position="absolute"
        top="5"
        right="5"
        src={launch.links.mission_patch_small}
        height={["85px", "150px"]}
        objectFit="contain"
        objectPosition="bottom"
      />
      <Heading
        color="white"
        display="inline"
        backgroundColor="#718096b8"
        fontSize={["lg", "5xl"]}
        px="4"
        py="2"
        borderRadius="lg"
      >
        {launch.mission_name}
      </Heading>
      <Stack isInline spacing="3" d="flex" alignItems="center">
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
        <Badge variantColor="purple" fontSize={["xs", "md"]}>
          #{launch.flight_number}
        </Badge>
        {launch.launch_success ? (
          <Badge variantColor="green" fontSize={["xs", "md"]}>
            Successful
          </Badge>
        ) : (
          <Badge variantColor="red" fontSize={["xs", "md"]}>
            Failed
          </Badge>
        )}
      </Stack>
    </Flex>
  );
}

function TimeAndLocation({ launch }) {
  const localTimeParsed = launch.launch_date_local.split("T")[1].split("-")[0]; // extract pad launch time from api response
  const [timeLocalPad, amPm] = transformAmPm(localTimeParsed); // return string with local time in 12h format (consistency with the User locale time format, which is AM/PM)
  const dateLocalPad = formatDateTime(launch.launch_date_local).split(",");
  const consolidatedDatePad = checkDayPadTime(
    launch.launch_date_local,
    dateLocalPad[0]
  ); // consolidate time at launch pad, since it can be different day from the User locale e.g. launch pad in Florida at 7pm is beyond midnight in UTC
  return (
    <SimpleGrid columns={[1, 1, 2]} borderWidth="1px" p="4" borderRadius="md">
      <Stat>
        <StatLabel display="flex">
          <Box as={Watch} width="1em" />{" "}
          <Box ml="2" as="span">
            Launch Date
          </Box>
        </StatLabel>
        <StatNumber fontSize={["md", "xl"]}>
          <Tooltip
            hasArrow
            label={formatDateTime(launch.launch_date_local)}
            aria-label="A tooltip"
            placement="bottom-end"
          >
            {`${consolidatedDatePad}, ${dateLocalPad[1]}, ${timeLocalPad} ${amPm} (Launch Pad time)`}
          </Tooltip>
        </StatNumber>
        <StatHelpText>{timeAgo(launch.launch_date_utc)}</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel display="flex">
          <Box as={MapPin} width="1em" />{" "}
          <Box ml="2" as="span">
            Launch Site
          </Box>
        </StatLabel>
        <StatNumber fontSize={["md", "xl"]}>
          <Link
            as={RouterLink}
            to={`/launch-pads/${launch.launch_site.site_id}`}
          >
            {launch.launch_site.site_name_long}
          </Link>
        </StatNumber>
        <StatHelpText>{launch.launch_site.site_name}</StatHelpText>
      </Stat>
    </SimpleGrid>
  );
}

function RocketInfo({ launch }) {
  const cores = launch.rocket.first_stage.cores;

  return (
    <SimpleGrid
      columns={[1, 1, 2]}
      borderWidth="1px"
      mt="4"
      p="4"
      borderRadius="md"
    >
      <Stat>
        <StatLabel display="flex">
          <Box as={Navigation} width="1em" />{" "}
          <Box ml="2" as="span">
            Rocket
          </Box>
        </StatLabel>
        <StatNumber fontSize={["md", "xl"]}>
          {launch.rocket.rocket_name}
        </StatNumber>
        <StatHelpText>{launch.rocket.rocket_type}</StatHelpText>
      </Stat>
      <StatGroup>
        <Stat>
          <StatLabel display="flex">
            <Box as={Layers} width="1em" />{" "}
            <Box ml="2" as="span">
              First Stage
            </Box>
          </StatLabel>
          <StatNumber fontSize={["md", "xl"]}>
            {cores.map((core) => core.core_serial).join(", ")}
          </StatNumber>
          <StatHelpText>
            {cores.every((core) => core.land_success)
              ? cores.length === 1
                ? "Recovered"
                : "All recovered"
              : "Lost"}
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel display="flex">
            <Box as={Layers} width="1em" />{" "}
            <Box ml="2" as="span">
              Second Stage
            </Box>
          </StatLabel>
          <StatNumber fontSize={["md", "xl"]}>
            Block {launch.rocket.second_stage.block}
          </StatNumber>
          <StatHelpText>
            Payload:{" "}
            {launch.rocket.second_stage.payloads
              .map((payload) => payload.payload_type)
              .join(", ")}
          </StatHelpText>
        </Stat>
      </StatGroup>
    </SimpleGrid>
  );
}

function Video({ launch }) {
  return (
    <AspectRatioBox maxH="400px" ratio={1.7}>
      <Box
        as="iframe"
        title={launch.mission_name}
        src={`https://www.youtube.com/embed/${launch.links.youtube_id}`}
        allowFullScreen
      />
    </AspectRatioBox>
  );
}

function Gallery({ images }) {
  return (
    <SimpleGrid my="6" minChildWidth="350px" spacing="4">
      {images.map((image) => (
        <a href={image} key={image}>
          <Image src={image.replace("_o.jpg", "_z.jpg")} />
        </a>
      ))}
    </SimpleGrid>
  );
}
