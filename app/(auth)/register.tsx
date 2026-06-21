import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Input, Paragraph, Spinner, YStack } from "tamagui";
import { ConfigBanner } from "../../components/ConfigBanner";
import { Field } from "../../components/Field";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../lib/auth";
import { showToast } from "../../lib/toast";

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    if (!fullName.trim() || !email.trim() || password.length < 6) {
      setError(
        "Enter your name, email, and a password of at least 6 characters.",
      );
      return;
    }
    setLoading(true);
    try {
      const { needsConfirmation } = await signUp(
        email.trim(),
        password,
        fullName.trim(),
      );
      if (needsConfirmation) {
        showToast("Check your email", {
          message: "Confirm your address, then log in.",
        });
        router.replace("/(auth)/login");
      }
    } catch (e: any) {
      setError(e?.message ?? "Could not create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <YStack flex={1} bg="$background" px="$5" py="$6" gap="$4">
      <ConfigBanner />

      <Field label="Full name">
        <Input
          value={fullName}
          onChangeText={setFullName}
          placeholder="Jane Doe"
          autoCapitalize="words"
          size="$4"
        />
      </Field>

      <Field label="Email">
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          size="$4"
        />
      </Field>

      <Field label="Password">
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          secureTextEntry
          size="$4"
        />
      </Field>

      {!!error && (
        <Paragraph color="$red10" size="$3">
          {error}
        </Paragraph>
      )}

      <PrimaryButton
        size="$5"
        onPress={onSubmit}
        disabled={loading}
        icon={loading ? <Spinner color="white" /> : undefined}
      >
        {loading ? "Creating account…" : "Create account"}
      </PrimaryButton>

      <Button
        chromeless
        fontWeight="600"
        color="$blue10"
        onPress={() => router.replace("/(auth)/login")}
      >
        Already have an account? Log in
      </Button>
    </YStack>
  );
}
