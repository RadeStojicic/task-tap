import { ChevronRight, MapPin } from "@tamagui/lucide-icons-2";
import { Link } from "expo-router";
import { Paragraph, SizableText, XStack, YStack } from "tamagui";
import { formatDate } from "../lib/format";
import { ReportWithProfiles } from "../types";
import { StatusBadge } from "./StatusBadge";

export function ReportCard({ report }: { report: ReportWithProfiles }) {
  return (
    <Link href={`/report/${report.id}`} asChild>
      <XStack
        items="center"
        gap="$3"
        bg="$background"
        borderWidth={1}
        borderColor="$borderColor"
        rounded="$6"
        p="$3.5"
        pressStyle={{ bg: "$backgroundPress" }}
      >
        <YStack flex={1} gap="$2">
          <XStack items="center" justify="space-between" gap="$2">
            <SizableText size="$5" fontWeight="700" flex={1} numberOfLines={1}>
              {report.title}
            </SizableText>
            <StatusBadge status={report.status} size="sm" />
          </XStack>
          <XStack items="center" gap="$3" flexWrap="wrap">
            {!!report.location && (
              <XStack items="center" gap="$1" maxW="70%">
                <MapPin size={13} color="$color10" />
                <Paragraph size="$2" color="$color10" numberOfLines={1}>
                  {report.location}
                </Paragraph>
              </XStack>
            )}
            <Paragraph size="$2" color="$color10">
              {formatDate(report.created_at)}
            </Paragraph>
          </XStack>
        </YStack>
        <ChevronRight size={18} color="$color9" />
      </XStack>
    </Link>
  );
}
