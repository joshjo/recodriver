import { Text, View } from "react-native";
import { useAuthToken } from "@hooks/auth";
import { useAuth } from "@context/auth";

export default function SignIn() {
  const { setToken } = useAuth();
  const authenticateUser = useAuthToken();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text onPress={() => setToken("user")}>Sign In</Text>
    </View>
  );
}
