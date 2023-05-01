import { Slot } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Provider } from "../context/auth";

const queryClient = new QueryClient();

export default function Root() {
  return (
    // Setup the auth context and render our layout inside of it.
    <QueryClientProvider client={queryClient}>
      <Provider>
        <Slot />
      </Provider>
    </QueryClientProvider>
  );
}
