import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Flex, Text } from "@chakra-ui/core";

import Launches from "./launches";
import Launch from "./launch";
import Home from "./home";
import LaunchPads from "./launch-pads";
import LaunchPad from "./launch-pad";

export default function App() {
  const [faveLaunches, setFaveLaunches] = useState([]);
  const [favePads, setFavePads] = useState([]);

  useEffect(() => {
    const dataLaunches = JSON.parse(localStorage.getItem("favoriteLaunches"));
    if (dataLaunches) {
      setFaveLaunches(dataLaunches);
    }

    const dataPads = JSON.parse(localStorage.getItem("favoritePads"));
    if (dataPads) {
      setFavePads(dataPads);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteLaunches", JSON.stringify(faveLaunches));

    localStorage.setItem("favoritePads", JSON.stringify(favePads));
  }, [faveLaunches, favePads]);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/launches"
          element={
            <Launches
              faveLaunches={faveLaunches}
              setFaveLaunches={setFaveLaunches}
            />
          }
        />
        <Route
          path="/launches/:launchId"
          element={
            <Launch
              faveLaunches={faveLaunches}
              setFaveLaunches={setFaveLaunches}
            />
          }
        />
        <Route
          path="/launch-pads"
          element={<LaunchPads favePads={favePads} setFavePads={setFavePads} />}
        />
        <Route
          path="/launch-pads/:launchPadId"
          element={
            <LaunchPad
              favePads={favePads}
              setFavePads={setFavePads}
              faveLaunches={faveLaunches}
              setFaveLaunches={setFaveLaunches}
            />
          }
        />
      </Routes>
    </div>
  );
}

function NavBar() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="6"
      bg="gray.800"
      color="white"
    >
      <Text
        fontFamily="mono"
        letterSpacing="2px"
        fontWeight="bold"
        fontSize="lg"
      >
        ¡SPACE·R0CKETS!
      </Text>
    </Flex>
  );
}
