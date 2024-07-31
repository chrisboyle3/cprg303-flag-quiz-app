import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="quiz" options={{ title: 'Flag Quiz' }} />
      <Stack.Screen name="results" options={{ title: 'Results' }} />
    </Stack>
  );
}