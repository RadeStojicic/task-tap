import { ClipboardList, Plus, User } from "@tamagui/lucide-icons-2";
import { Tabs } from "expo-router";
import { useAuth } from "../../lib/auth";

export default function TabsLayout() {
  const { isAdmin } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
        },
        headerStyle: { backgroundColor: "#ffffff" },
        headerShadowVisible: false,
        headerTintColor: "#111111",
        headerTitleStyle: { fontWeight: "800" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isAdmin ? "All Reports" : "My Reports",
          tabBarLabel: "Reports",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color as any} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "New Report",
          tabBarIcon: ({ color, size }) => (
            <Plus color={color as any} size={size} />
          ),
          href: isAdmin ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User color={color as any} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
