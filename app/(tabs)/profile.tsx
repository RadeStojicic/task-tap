import { LogOut, ShieldCheck, User as UserIcon } from "@tamagui/lucide-icons-2";
import {
  Button,
  Circle,
  Paragraph,
  Separator,
  SizableText,
  XStack,
  YStack,
} from "tamagui";
import { useAuth } from "../../lib/auth";
import { initials } from "../../lib/format";

export default function ProfileScreen() {
  const { profile, session, signOut, isAdmin } = useAuth();

  const name =
    profile?.full_name?.trim() ||
    profile?.email ||
    session?.user.email ||
    "User";
  const email = profile?.email || session?.user.email || "";

  return (
    <YStack flex={1} bg="$background" px="$5" py="$6" gap="$5">
      <YStack items="center" gap="$3" pt="$4">
        <Circle size={92} bg="$blue4">
          <SizableText size="$8" fontWeight="900" color="$blue11">
            {initials(name)}
          </SizableText>
        </Circle>

        <YStack items="center" gap="$1">
          <SizableText size="$7" fontWeight="800">
            {name}
          </SizableText>
          {!!email && <Paragraph color="$color10">{email}</Paragraph>}
        </YStack>

        <XStack
          items="center"
          gap="$1.5"
          bg={isAdmin ? "$purple4" : "$gray4"}
          px="$3"
          py="$1.5"
          rounded="$10"
        >
          {isAdmin ? (
            <ShieldCheck size={15} color="$purple11" />
          ) : (
            <UserIcon size={15} color="$gray11" />
          )}
          <SizableText
            size="$2"
            fontWeight="700"
            color={isAdmin ? "$purple11" : "$gray11"}
          >
            {isAdmin ? "Administrator" : "User"}
          </SizableText>
        </XStack>
      </YStack>

      <Separator />

      <YStack flex={1} />

      <Button
        size="$5"
        theme="red"
        fontWeight="700"
        icon={<LogOut size={18} />}
        onPress={signOut}
      >
        Log out
      </Button>
    </YStack>
  );
}
