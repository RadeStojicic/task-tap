import { Slot } from "expo-router";
import { Provider } from "../components/Provider";
import { AuthProvider } from "../lib/auth";

export default function Layout() {
  return (
    <Provider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </Provider>
  );
}
