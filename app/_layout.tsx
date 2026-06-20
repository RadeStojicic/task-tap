import { Slot } from "expo-router";
import { Provider } from "../components/Provider";

export default function Layout() {
  return (
    <Provider>
      <Slot />
    </Provider>
  );
}