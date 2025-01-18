import { useFonts } from 'expo-font';
import { Stack, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Appearance } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useEffect } from 'react';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme()
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    //   <Stack>
    //     <Stack.Screen name="(note)" options={{ headerShown: false }} />
        
    //     <Stack.Screen name="+not-found" />
    //   </Stack>
    //   <StatusBar style="auto" />
    // </ThemeProvider>
      <Tabs screenOptions={{ headerStyle: { backgroundColor: theme.headerBackground }, headerTintColor: theme.text, headerShadowVisible: false }}>
        <Tabs.Screen 
        name="index" 
        options={{ headerShown: false, title: 'Scheduling',
          tabBarIcon: ({ focused }) => (
            <SimpleLineIcons name="note" size={24} color="black" />
          ),
         }} 
        />
        <Tabs.Screen name="notes" options={{ headerShown: true, title: 'Emo', headerTitle: 'Note List',
          tabBarIcon: ({ focused }) => (
            <Feather name="list" size={24} color="black" />
          ),
         }} />
        <Tabs.Screen name="sketch" options={{ headerShown: true, title: 'Analyze', headerTitle: 'Sketch',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="draw" size={24} color="black" />
          ),
         }} />
        <Tabs.Screen name="+not-found" options={{ headerShown: false }} />
        <Stack.Screen name="list/[id]" options={{ headerShown: true, title: 'Note Detail' }} />
      </Tabs>
      
      
    
  );
}
