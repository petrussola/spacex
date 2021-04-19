import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  SimpleGrid,
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
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{`Favorite ${pageName}`}</DrawerHeader>
        <DrawerBody>
          <SimpleGrid m={[2, null, 6]} minChildWidth="350px" spacing="4">
            {faveLaunches.map((launch) => {
              return (
                <LaunchItem
                  isFavMenu={true}
                  launch={launch}
                  key={launch.flight_number}
                  faveLaunches={faveLaunches}
                  setFaveLaunches={setFaveLaunches}
                />
              );
            })}
          </SimpleGrid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
