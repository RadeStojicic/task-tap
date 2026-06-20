import { Wrench } from "@tamagui/lucide-icons-2";
import { H1, Paragraph, YStack } from "tamagui";

export default function WelcomeScreen() {
  return (
    <YStack flex={1} bg="$background" px="$5" py="$8" justify="space-between">
      <YStack flex={1} items="center" justify="center" gap="$5">
        <YStack bg="$blue4" p="$5" rounded="$9">
          <Wrench size={44} color="$blue10" />
        </YStack>
        <YStack items="center" gap="$2">
          <H1 fontWeight="900" letterSpacing={-1}>
            TaskTap
          </H1>
          <Paragraph size="$5" color="$color10" text="center" maxW={300}>
            Report and track maintenance issues in your space — fast.
          </Paragraph>
        </YStack>
      </YStack>
    </YStack>
  );
}
