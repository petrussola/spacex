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
import { LaunchPadItem } from "./launch-pads";

export default function DrawerComponent({
  isOpen,
  onClose,
  btnRef,
  faveLaunches,
  setFaveLaunches,
  favePads,
  setFavePads,
  listItems,
  setListItems,
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
            {listItems.length === 0
              ? `No favorite ${pageName} yet. Click on the star to get started!`
              : listItems.map((item) => {
                  return (
                    <WrappedComponent
                      isFavMenu={true}
                      item={item}
                      key={
                        item.flight_number ? item.flight_number : item.site_id
                      }
                      faveLaunches={faveLaunches}
                      setFaveLaunches={setFaveLaunches}
                      favePads={favePads}
                      setFavePads={setFavePads}
                      pageName={pageName}
                      listItems={listItems}
                      setListItems={setListItems}
                    />
                  );
                })}
          </SimpleGrid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

const WrappedComponent = ({ pageName, item, listItems, setListItems }) => {
  if (pageName === "launches") {
    return (
      <LaunchItem
        isFavMenu={true}
        launch={item}
        key={item.flight_number}
        faveLaunches={listItems}
        setFaveLaunches={setListItems}
      />
    );
  } else if (pageName === "launch-pads") {
    return (
      <LaunchPadItem
        isFavMenu={true}
        launchPad={item}
        key={item.site_id}
        favePads={listItems}
        setFavePads={setListItems}
      />
    );
  }
};
