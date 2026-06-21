import { Circle, SizableText, XStack } from "tamagui";
import { ReportStatus } from "../types";

const STATUS_META = {
  new: { label: "New", color: "$blue11", bg: "$blue4", dot: "$blue9" },
  in_progress: {
    label: "In Progress",
    color: "$orange11",
    bg: "$orange4",
    dot: "$orange9",
  },
  resolved: {
    label: "Resolved",
    color: "$green11",
    bg: "$green4",
    dot: "$green9",
  },
} as const;

export function statusLabel(status: ReportStatus): string {
  return STATUS_META[status].label;
}

export function StatusBadge({
  status,
  size = "md",
}: {
  status: ReportStatus;
  size?: "sm" | "md";
}) {
  const meta = STATUS_META[status];
  const small = size === "sm";
  return (
    <XStack
      items="center"
      gap="$1.5"
      bg={meta.bg}
      px={small ? "$2" : "$2.5"}
      py={small ? "$1" : "$1.5"}
      rounded="$10"
      self="flex-start"
    >
      <Circle size={small ? 6 : 8} bg={meta.dot} />
      <SizableText
        size={small ? "$1" : "$2"}
        color={meta.color}
        fontWeight="700"
      >
        {meta.label}
      </SizableText>
    </XStack>
  );
}
