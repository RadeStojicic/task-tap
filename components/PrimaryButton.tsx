import { Button, type ButtonProps } from "tamagui";

export function PrimaryButton(props: ButtonProps) {
  return (
    <Button
      bg="$blue9"
      color="white"
      fontWeight="800"
      pressStyle={{ bg: "$blue10", borderColor: "$blue10" }}
      disabledStyle={{ opacity: 0.5 }}
      {...props}
    />
  );
}
