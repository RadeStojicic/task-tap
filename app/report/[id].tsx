import { Check, MapPin, Trash2, UserCheck } from "@tamagui/lucide-icons-2";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { EmptyState } from "../../components/EmptyState";
import { StatusBadge } from "../../components/StatusBadge";

import { useCallback, useState } from "react";
import { Image } from "react-native";
import {
  Button,
  H5,
  Paragraph,
  ScrollView,
  Separator,
  SizableText,
  Spinner,
  XStack,
  YStack,
} from "tamagui";
import { deleteReport, fetchReport, updateReport } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { formatDateTime } from "../../lib/format";
import { showToast } from "../../lib/toast";
import type { ReportItem, ReportStatus, ReportWithProfiles } from "../../types";

const STATUS_OPTIONS: { key: ReportStatus; label: string }[] = [
  { key: "new", label: "New" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

const CATEGORY_LABELS: Record<string, string> = {
  electrical: "Electrical",
  plumbing: "Plumbing",
  structural: "Structural",
  other: "Other",
};

export default function ReportDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, isAdmin } = useAuth();
  const router = useRouter();

  const [report, setReport] = useState<ReportWithProfiles | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setReport(await fetchReport(id));
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Could not load this report.");
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [load]),
  );

  async function changeStatus(status: ReportStatus) {
    if (!report || status === report.status) return;
    setBusy(true);
    try {
      await updateReport(report.id, { status });
      await load();
      showToast("Status updated", {
        message: `Marked as ${status.replace("_", " ")}.`,
      });
    } catch (e: any) {
      setError(e?.message ?? "Could not update the status.");
    } finally {
      setBusy(false);
    }
  }

  async function assignToMe() {
    if (!report || !profile) return;
    setBusy(true);
    try {
      await updateReport(report.id, { assigned_to: profile.id });
      await load();
      showToast("Assigned to you");
    } catch (e: any) {
      setError(e?.message ?? "Could not assign this report.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!report) return;
    setBusy(true);
    try {
      await deleteReport(report.id);
      showToast("Report deleted");
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e?.message ?? "Could not delete this report.");
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <YStack flex={1} bg="$background" items="center" justify="center">
        <Spinner size="large" color="$color10" />
      </YStack>
    );
  }

  if (!report) {
    return (
      <EmptyState
        title="Report not found"
        message={error ?? "It may have been removed."}
      />
    );
  }

  const reporterName =
    report.reporter?.full_name?.trim() || report.reporter?.email || null;
  const assigneeName =
    report.assignee?.full_name?.trim() || report.assignee?.email || null;
  const assignedToMe = !!profile && report.assigned_to === profile.id;
  const items = report.report_items ?? [];

  return (
    <>
      <Stack.Screen options={{ title: "Report details" }} />
      <ScrollView bg="$background">
        <YStack gap="$4" p="$5" pb="$8">
          <YStack gap="$3">
            <StatusBadge status={report.status} />
            <SizableText size="$8" fontWeight="900">
              {report.title}
            </SizableText>
            {!!report.location && (
              <XStack items="center" gap="$1.5">
                <MapPin size={15} color="$color10" />
                <Paragraph color="$color10">{report.location}</Paragraph>
              </XStack>
            )}
          </YStack>

          <Separator />

          {/* Items list */}
          <YStack gap="$3">
            <H5 color="$color11">
              {items.length === 0 ? "No items" : `Items (${items.length})`}
            </H5>

            {items.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} />
            ))}
          </YStack>

          <Separator />

          <YStack gap="$2.5">
            <DetailRow label="Reported by" value={reporterName ?? "—"} />
            <DetailRow
              label="Assigned to"
              value={assigneeName ?? "Unassigned"}
            />
            <DetailRow
              label="Created"
              value={formatDateTime(report.created_at)}
            />
            <DetailRow
              label="Updated"
              value={formatDateTime(report.updated_at)}
            />
          </YStack>

          {isAdmin && (
            <>
              <Separator />
              <YStack gap="$3">
                <H5 color="$color11">Update status</H5>
                <XStack gap="$2" flexWrap="wrap">
                  {STATUS_OPTIONS.map((o) => {
                    const active = report.status === o.key;
                    return (
                      <Button
                        key={o.key}
                        size="$3.5"
                        disabled={busy}
                        bg={active ? "$blue9" : "$background"}
                        color={active ? "white" : "$color11"}
                        borderColor={active ? "$blue9" : "$borderColor"}
                        iconAfter={
                          active ? <Check size={16} color="white" /> : undefined
                        }
                        onPress={() => changeStatus(o.key)}
                      >
                        {o.label}
                      </Button>
                    );
                  })}
                </XStack>

                <Button
                  size="$4"
                  disabled={busy || assignedToMe}
                  icon={<UserCheck size={18} />}
                  onPress={assignToMe}
                >
                  {assignedToMe ? "Assigned to you" : "Assign to me"}
                </Button>

                <Button
                  size="$4"
                  theme="red"
                  chromeless
                  disabled={busy}
                  self="flex-start"
                  icon={<Trash2 size={18} />}
                  onPress={onDelete}
                >
                  Delete report
                </Button>
              </YStack>
            </>
          )}

          {!!error && (
            <Paragraph color="$red10" size="$3">
              {error}
            </Paragraph>
          )}
        </YStack>
      </ScrollView>
    </>
  );
}

function ItemCard({ item, index }: { item: ReportItem; index: number }) {
  return (
    <YStack
      gap="$2"
      p="$3.5"
      borderWidth={1}
      borderColor="$borderColor"
      // borderRadius="$4"
    >
      <XStack justify="space-between" items="center">
        <Paragraph fontWeight="700" size="$4">
          {index + 1}. {item.description}
        </Paragraph>
        <Paragraph
          size="$2"
          color="$color10"
          px="$2"
          py="$1"
          bg="$color3"
          // borderRadius="$2"
        >
          {CATEGORY_LABELS[item.category] ?? item.category}
        </Paragraph>
      </XStack>

      {!!item.photo_url && (
        <Image
          source={{ uri: item.photo_url }}
          style={{ width: "100%", height: 160, borderRadius: 8 }}
        />
      )}
    </YStack>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <XStack justify="space-between" gap="$3">
      <Paragraph color="$color10">{label}</Paragraph>
      <Paragraph fontWeight="700" flex={1} text="right">
        {value}
      </Paragraph>
    </XStack>
  );
}
