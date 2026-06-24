import { Camera, ImagePlus, Plus, Trash2, X } from "@tamagui/lucide-icons-2";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image } from "react-native";
import {
  Button,
  Input,
  Paragraph,
  ScrollView,
  Separator,
  Spinner,
  XStack,
  YStack,
} from "tamagui";
import { Field } from "../../components/Field";
import { PrimaryButton } from "../../components/PrimaryButton";
import { createReport, createReportItems } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { uploadReportPhoto } from "../../lib/storage";
import { showToast } from "../../lib/toast";
import { ReportItemCategory } from "../../types";

interface PickedPhoto {
  uri: string;
  base64: string;
  mime: string;
}

interface ItemDraft {
  description: string;
  category: ReportItemCategory;
  photo: PickedPhoto | null;
}

const CATEGORIES: { value: ReportItemCategory; label: string }[] = [
  { value: "other", label: "Other" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "structural", label: "Structural" },
];

function emptyItem(): ItemDraft {
  return { description: "", category: "other", photo: null };
}

export default function NewReportScreen() {
  const { session } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([emptyItem()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateItem(index: number, patch: Partial<ItemDraft>) {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function applyPhoto(index: number, res: ImagePicker.ImagePickerResult) {
    if (res.canceled || !res.assets?.length) return;
    const a = res.assets[0];
    if (!a.base64) {
      setError("Could not read the selected image.");
      return;
    }
    updateItem(index, {
      photo: { uri: a.uri, base64: a.base64, mime: a.mimeType ?? "image/jpeg" },
    });
    setError(null);
  }

  async function pickFromLibrary(index: number) {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });
    applyPhoto(index, res);
  }

  async function takePhoto(index: number) {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setError("Camera permission is required to take a photo.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });
    applyPhoto(index, res);
  }

  async function onSubmit() {
    setError(null);
    if (!title.trim()) {
      setError("A title is required.");
      return;
    }
    if (items.some((it) => !it.description.trim())) {
      setError("Every item needs a description.");
      return;
    }
    if (!session) {
      setError("You must be logged in to submit a report.");
      return;
    }
    setSubmitting(true);
    try {
      const report = await createReport({
        title: title.trim(),
        location: location.trim() || null,
        reported_by: session.user.id,
      });

      const photoUrls = await Promise.all(
        items.map((it) =>
          it.photo
            ? uploadReportPhoto(it.photo.base64, it.photo.mime)
            : Promise.resolve(null),
        ),
      );

      await createReportItems(
        items.map((it, i) => ({
          report_id: report.id,
          description: it.description.trim(),
          category: it.category,
          photo_url: photoUrls[i],
        })),
      );

      showToast("Report submitted", { message: "Your issue has been logged." });
      setTitle("");
      setLocation("");
      setItems([emptyItem()]);
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e?.message ?? "Could not submit the report.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView bg="$background">
      <YStack gap="$4" p="$5" pb="$8">
        <Field label="Title *">
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Bathroom issues, 2nd floor"
            size="$4"
          />
        </Field>

        <Field label="Location">
          <Input
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. 2nd floor, Room 204"
            size="$4"
          />
        </Field>

        <Separator />

        <Paragraph fontWeight="700" size="$5">
          Items ({items.length})
        </Paragraph>

        {items.map((item, index) => (
          <YStack
            key={index}
            gap="$3"
            p="$4"
            borderWidth={1}
            borderColor="$borderColor"
            // borderRadius="$4"
          >
            <XStack justify="space-between" items="center">
              <Paragraph fontWeight="600" color="$color10">
                Item {index + 1}
              </Paragraph>
              {items.length > 1 && (
                <Button
                  size="$2"
                  chromeless
                  color="$red10"
                  icon={<Trash2 size={15} />}
                  onPress={() => removeItem(index)}
                />
              )}
            </XStack>

            <Field label="Description *">
              <Input
                value={item.description}
                onChangeText={(v) => updateItem(index, { description: v })}
                placeholder="e.g. Leaking faucet under the sink"
                size="$4"
              />
            </Field>

            <Field label="Category">
              <XStack gap="$2" flexWrap="wrap">
                {CATEGORIES.map((cat) => {
                  const active = item.category === cat.value;
                  return (
                    <Button
                      key={cat.value}
                      size="$3"
                      bg={active ? "$blue9" : "$background"}
                      color={active ? "white" : "$color11"}
                      borderColor={active ? "$blue9" : "$borderColor"}
                      onPress={() => updateItem(index, { category: cat.value })}
                    >
                      {cat.label}
                    </Button>
                  );
                })}
              </XStack>
            </Field>

            <Field label="Photo">
              {item.photo ? (
                <YStack gap="$2">
                  <Image
                    source={{ uri: item.photo.uri }}
                    style={{ width: "100%", height: 160, borderRadius: 10 }}
                  />
                  <Button
                    size="$3"
                    chromeless
                    color="$red10"
                    self="flex-start"
                    icon={<X size={15} />}
                    onPress={() => updateItem(index, { photo: null })}
                  >
                    Remove photo
                  </Button>
                </YStack>
              ) : (
                <XStack gap="$3">
                  <Button
                    flex={1}
                    size="$3.5"
                    icon={<ImagePlus size={16} />}
                    onPress={() => pickFromLibrary(index)}
                  >
                    Gallery
                  </Button>
                  <Button
                    flex={1}
                    size="$3.5"
                    icon={<Camera size={16} />}
                    onPress={() => takePhoto(index)}
                  >
                    Camera
                  </Button>
                </XStack>
              )}
            </Field>
          </YStack>
        ))}

        <Button
          size="$4"
          variant="outlined"
          icon={<Plus size={18} />}
          onPress={addItem}
        >
          Add another item
        </Button>

        {!!error && (
          <Paragraph color="$red10" size="$3">
            {error}
          </Paragraph>
        )}

        <PrimaryButton
          size="$5"
          onPress={onSubmit}
          disabled={submitting}
          icon={submitting ? <Spinner color="white" /> : undefined}
        >
          {submitting ? "Submitting…" : "Submit report"}
        </PrimaryButton>
      </YStack>
    </ScrollView>
  );
}
