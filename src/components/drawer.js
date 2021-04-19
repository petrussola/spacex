import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/core";
import { useLocation } from "react-router-dom";

import { LaunchItem } from "./launches";

export default function DrawerComponent({
  isOpen,
  onClose,
  btnRef,
  faveLaunches,
  setFaveLaunches,
}) {
  const location = useLocation();
  const pageName = location.pathname.split("/")[1];

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
      scrollBehavior="inside"
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{`Favorite ${pageName}`}</DrawerHeader>
        <DrawerBody>
          {faveLaunches.map((launch) => {
            return (
              <LaunchItem
                launch={launch}
                key={launch.flight_number}
                faveLaunches={faveLaunches}
                setFaveLaunches={setFaveLaunches}
              />
            );
          })}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
