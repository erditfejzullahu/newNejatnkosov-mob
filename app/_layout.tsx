import { BottomShelfProvider } from "@/context/bottom-shelf-provider";
import { CityDateProvider } from "@/context/city-date-change-provider";
import { QueryProvider } from "@/context/query-provider";
import { Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_900Black, useFonts } from "@expo-google-fonts/montserrat";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import '../assets/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    "mlight": Montserrat_300Light,
    "mregular": Montserrat_400Regular,
    "mmedium": Montserrat_500Medium,
    "msemibold": Montserrat_600SemiBold,
    "mbold": Montserrat_700Bold,
    "mblack": Montserrat_900Black
  })

  useEffect(() => {
    if(loaded || error){
      SplashScreen.hideAsync();
    }
  }, [error, loaded])
  
  if(!loaded && !error){
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryProvider>
        <CityDateProvider>
          <BottomShelfProvider>
            <Stack screenOptions={{headerShown: false}}/>
          </BottomShelfProvider>
        </CityDateProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  )
}
