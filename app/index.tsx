import CityPicker from "@/components/CityPicker";
import Header from "@/components/Header";
import { useBottomShelf } from "@/context/bottom-shelf-provider";
import { api } from "@/lib/api";
import { KosovoCity, Nejat } from "@/types/nejat";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
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
  const [city, setCity] = useState<KosovoCity | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const { isOpen, toggle } = useBottomShelf();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Handle bottom sheet visibility
  useEffect(() => {
    if (bottomSheetRef.current) {
      if (isOpen) {
        bottomSheetRef.current.present(); // Use present() instead of expand()
      }else{
        bottomSheetRef.current.dismiss();
      }
    }
  }, [isOpen]);

   const limit = 12;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<ApiResponse, Error, InfiniteQueryData>({
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

      const response = await api.get<ApiResponse>(`/nejat?${params.toString()}`);
      return response.data;
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
  // ... (keep your existing query logic)

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : undefined} style={{ flex: 1, backgroundColor: "white" }}>
        <FlatList 
          keyboardShouldPersistTaps={"handled"}
          data={[]}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {/* <Text>{item.name}</Text> */}
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
          ListHeaderComponent={
            <Header 
              onSearch={setSearch} 
              onCityChange={setCity} 
              onDateRangeChange={(start, end) => setDateRange({ start, end })} 
            />
          }
          ListFooterComponent={<View style={{ height: 50 }} />} // Spacer instead of modal here
          onEndReached={handleShowMore}
          onEndReachedThreshold={0.5}
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