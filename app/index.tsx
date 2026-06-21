import { Wrench } from "@tamagui/lucide-icons-2";

import { useRouter } from "expo-router";
import { Button, H1, Paragraph, YStack } from "tamagui";
import { ConfigBanner } from "../components/ConfigBanner";
import { PrimaryButton } from "../components/PrimaryButton";

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <YStack flex={1} bg="$background" px="$5" py="$8" justify="space-between">
      <YStack flex={1} items="center" justify="center" gap="$5">
        <YStack bg="$blue4" p="$5" rounded="$9">
          <Wrench size={34} color="$blue10" />
        </YStack>
        <YStack items="center" gap="$4">
          <H1 fontWeight="900" letterSpacing={-1}>
            TaskTap
          </H1>
          <Paragraph size="$4" color="$color10" text="center" maxW={300}>
            Report and track maintenance issues in your space - fast.
          </Paragraph>
        </YStack>
      </YStack>

      <YStack gap="$3">
        <ConfigBanner />
        <PrimaryButton
          size="$5"
          onPress={() => router.push("/(auth)/register")}
        >
          Get started
        </PrimaryButton>
        <Button
          size="$4"
          chromeless
          fontWeight="600"
          color="$blue10"
          onPress={() => router.push("/(auth)/login")}
        >
          I already have an account
        </Button>
      </YStack>
    </YStack>
  );
}
