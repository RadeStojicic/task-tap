import { Plus } from "@tamagui/lucide-icons-2";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { Button, ScrollView, Spinner, XStack, YStack } from "tamagui";
import { EmptyState } from "../../components/EmptyState";
import { ReportCard } from "../../components/ReportCard";
import { fetchReports } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ReportStatus, ReportWithProfiles } from "../../types";

const FILTERS: { key: ReportStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

export default function ReportsListScreen() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<ReportWithProfiles[]>([]);
  const [filter, setFilter] = useState<ReportStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (status: ReportStatus | "all") => {
    setError(null);
    try {
      const data = await fetchReports(status === "all" ? undefined : status);
      setReports(data);
    } catch (e: any) {
      setError(e?.message ?? "Could not load reports.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load(filter).finally(() => setLoading(false));
    }, [filter, load]),
  );

  async function onRefresh() {
    setRefreshing(true);
    await load(filter);
    setRefreshing(false);
  }

  return (
    <YStack flex={1} bg="$background">
      {isAdmin && (
        <XStack
          gap="$2"
          px="$4"
          py="$3"
          flexWrap="wrap"
          borderBottomWidth={1}
          borderColor="$borderColor"
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <Button
                key={f.key}
                size="$2.5"
                rounded="$10"
                bg={active ? "$blue9" : "$background"}
                color={active ? "white" : "$color11"}
                borderColor={active ? "$blue9" : "$borderColor"}
                onPress={() => setFilter(f.key)}
              >
                {f.label}
              </Button>
            );
          })}
        </XStack>
      )}

      {loading ? (
        <YStack flex={1} items="center" justify="center">
          <Spinner size="large" color="$color10" />
        </YStack>
      ) : error ? (
        <EmptyState title="Something went wrong" message={error} />
      ) : reports.length === 0 ? (
        <EmptyState
          title={isAdmin ? "No reports yet" : "You have no reports"}
          message={
            isAdmin
              ? "Reports submitted by users will appear here."
              : "Tap the + button to report your first issue."
          }
        />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <YStack gap="$3" p="$4">
            {reports.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </YStack>
        </ScrollView>
      )}

      {!isAdmin && (
        <Button
          position="absolute"
          b="$5"
          r="$5"
          size="$6"
          circular
          bg="$blue9"
          pressStyle={{ bg: "$blue10" }}
          icon={<Plus size={26} color="white" />}
          onPress={() => router.push("/(tabs)/new")}
          elevation="$4"
        />
      )}
    </YStack>
  );
}
