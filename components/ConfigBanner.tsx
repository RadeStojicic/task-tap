import { TriangleAlert } from "@tamagui/lucide-icons-2";
import { Paragraph, XStack } from "tamagui";
import { isSupabaseConfigured } from "../lib/env";

export function ConfigBanner() {
  if (isSupabaseConfigured()) return null;
  return (
    <XStack
      items="center"
      gap="$2.5"
      bg="$yellow3"
      borderColor="$yellow7"
      borderWidth={1}
      rounded="$5"
      p="$3"
    >
      <TriangleAlert size={18} color="$yellow11" />
      <Paragraph size="$2" color="$yellow11" flex={1}>
        Supabase isn’t configured yet. Add your project URL and anon key to{" "}
        <Paragraph size="$2" fontWeight="800" color="$yellow11">
          .env
        </Paragraph>
        , then restart with the cache cleared.
      </Paragraph>
    </XStack>
  );
}
