import type { ReactNode } from "react";
import { SizableText, YStack } from "tamagui";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <YStack gap="$1.5">
      <SizableText size="$2" color="$color11" fontWeight="700">
        {label}
      </SizableText>
      {children}
    </YStack>
  );
}
