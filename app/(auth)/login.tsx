import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Input, Paragraph, Spinner, YStack } from "tamagui";
import { ConfigBanner } from "../../components/ConfigBanner";
import { Field } from "../../components/Field";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../lib/auth";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      setError(e?.message ?? "Could not log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <YStack flex={1} bg="$background" px="$5" py="$6" gap="$4">
      <ConfigBanner />

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
          placeholder="••••••••"
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
        {loading ? "Logging in…" : "Log in"}
      </PrimaryButton>

      <Button
        chromeless
        fontWeight="600"
        color="$blue10"
        onPress={() => router.push("/(auth)/register")}
      >
        No account? Create one
      </Button>
    </YStack>
  );
}
