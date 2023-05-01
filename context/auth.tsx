import { useRouter, useSegments } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from "react";
import { TOKEN_KEY } from "@constants";

const AuthContext = React.createContext(null);


// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/map");
    }
  }, [user, segments]);
}

export function Provider(props) {
  const [user, setAuth] = React.useState(null);

  async function setToken(token: string) {
    setAuth({});
  }

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        setToken,
        signOut: () => setAuth(null),
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}