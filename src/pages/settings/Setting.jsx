import React, { useState } from "react";
import {
  Tabs,
  Card,
  Skeleton,
  ColorInput,
  Text,
  Button,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { IconPhoto, IconMessageCircle, IconSettings } from "@tabler/icons";
import BreadCrumb from "../../components/BreadCrumb";
import { Help, Palette } from "tabler-icons-react";

function Setting() {
  // Setting the variables data list here
  const [variables, setVariables] = useState({
    skeletonLoading: false,
    loader: false,
    defaultColor: "#212121",
  });
  const [color, setColor] = useState(localStorage.getItem("color"));

  const setValue = () => {
    setVariables({ ...variables, loader: true });
    localStorage.setItem("color", color.toString());
    window.location.reload();
  };
  const setDefault = () => {
    setVariables({ ...variables, loader: true });
    localStorage.setItem("color", "#212121");
    window.location.reload();
  };

  return (
    <div>
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <BreadCrumb Text="Setting" />
      </Skeleton>
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <LoadingOverlay visible={variables.loader} overlayBlur={2} />
        <Card className="border">
          <Tabs orientation="vertical" defaultValue="Color">
            <Tabs.List>
              <Tabs.Tab value="Color" icon={<Palette size={14} />}>
                Display Color
              </Tabs.Tab>

              <Tabs.Tab value="Help" icon={<Help size={14} />}>
                Help / Support
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="Color" pl="xs">
              <ColorInput
                placeholder="Pick color"
                value={color}
                label="Pick a color you like"
                onChange={setColor}
              />
              <Text size="xs">Pick color with dark shade only</Text>
              <Group>
                <Button mt="xl" color="zevcore" onClick={setValue}>
                  Submit
                </Button>
                <Button mt="xl" color="yellow" onClick={setDefault}>
                  Set Default
                </Button>
              </Group>
            </Tabs.Panel>

            <Tabs.Panel value="Help" pl="xs">
              <Text size="lg" weight={500}>
                Contact
              </Text>
              <Text> Email: support@zevcore.com </Text>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Skeleton>
    </div>
  );
}

export default Setting;
