import CityPicker from "@/components/CityPicker";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import { useBottomShelf } from "@/context/bottom-shelf-provider";
import { useCityDate } from "@/context/city-date-change-provider";
import { api } from "@/lib/api";
import { Nejat } from "@/types/nejat";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, RefreshControl, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type ApiResponse = {
  data: Nejat[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
};

type InfiniteQueryData = {
  pages: ApiResponse[];
  pageParams: number[];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false)
  const queryClient = useQueryClient();

  
  const { isOpen, toggle } = useBottomShelf();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  
  const {city, dateRange} = useCityDate();

  const onRefresh = async () => {
    setRefreshing(true)
    await queryClient.cancelQueries({queryKey: ['events', search, city, dateRange]})
    await queryClient.resetQueries({
      queryKey: ['events', search, city, dateRange],
      exact: true
    })
    await refetch()
    setRefreshing(false)
  }

  useEffect(() => {
    if (bottomSheetRef.current) {
      if (isOpen) {
        bottomSheetRef.current.present();
      }else{
        bottomSheetRef.current.dismiss();
      }
    }
  }, [isOpen]);

   const limit = 12;   

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery<ApiResponse, Error, InfiniteQueryData>({
    queryKey: ['events', search, city, dateRange],
    initialPageParam: 1,
    queryFn: async (context) => {
      const pageParam = context.pageParam as number;
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (city !== 'ALL') params.append('city', city);
      if (dateRange.start) params.append('startDate', dateRange.start.toISOString());
      if (dateRange.end) params.append('endDate', dateRange.end.toISOString());
      params.append('page', pageParam.toString());
      params.append('limit', limit.toString());

      try {
        const response = await api.get<ApiResponse>(`/nejat?${params.toString()}`);
        console.log('API Response:', response.data); // Add this to debug
        return response.data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      if (currentPage < lastPage.meta.totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  

  
  const handleShowMore = useCallback(() => {
    if (!isLoading && hasNextPage) {
      fetchNextPage();
    }
  }, [isLoading, hasNextPage, fetchNextPage]);
  
  const allEvents = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);
  console.log(allEvents)
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : undefined} style={{ flex: 1, backgroundColor: "white" }}>
        <Header 
          onSearch={setSearch} 
        />
        <FlatList 
          className="mt-6"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              // Optional props:
              colors={['#eab308', '#eab308']} // Android
              tintColor="#eab308" // iOS
              title="Pull to refresh" // iOS
              titleColor="#eab308" // iOS
            />
          }
          keyboardShouldPersistTaps={"handled"}
          data={allEvents}
          renderItem={({ item }) => (
            <EventCard event={item}/>
          )}
          contentContainerStyle={styles.flatListContent}
          ListFooterComponent={() => (
            <View className="">
              {isLoading && hasNextPage ? (
                <Text className="text-center">Please wait...</Text>
              ) : !isLoading && !hasNextPage ? (
                <Text className="text-center">No more event are left.</Text>
              ) : isFetchingNextPage ? (
                <Text className="text-center">No events found</Text>
              ) : null}
            </View>
          )} // Spacer instead of modal here
          onEndReached={handleShowMore}
          onEndReachedThreshold={0}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text>No events found</Text>
            </View>
          }
        />

        {/* Move BottomSheetModal outside FlatList */}
        <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0} // Start expanded
          snapPoints={["30%", '50%']}
          enableDynamicSizing={false}
          enablePanDownToClose={true}
          style={styles.bottomSheet}
          backdropComponent={({ style }) => (
            <View 
              style={[style, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
              onTouchEnd={() => toggle()}
            />
          )}
        >
          <View style={styles.bottomSheetContent}>
            <CityPicker />
          </View>
        </BottomSheetModal>
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 50, // Add padding for the bottom sheet
    paddingLeft: 16,
    paddingRight: 16
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});