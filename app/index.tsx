import Header from "@/components/Header";
import { useBottomShelf } from "@/context/bottom-shelf-provider";
import { api } from "@/lib/api";
import { KosovoCity, Nejat } from "@/types/nejat";
import BottomSheet from "@gorhom/bottom-sheet";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
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

  const {isOpen} = useBottomShelf();
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if(bottomSheetRef.current){
      if(isOpen){
        bottomSheetRef.current.close();
      }else{
        bottomSheetRef.current.expand();
      }
    }
  }, [isOpen])
  

  const snapPoints = useMemo(() => ['25%', '50%'], []);

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

  const showLoading = isLoading && !data;
  const showEmptyState = allEvents.length === 0 && !isLoading;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList 
          data={allEvents}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.name}</Text>
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
          ListFooterComponent={
            <View style={styles.footerContainer}>
              <BottomSheet
                // detached
                enableDynamicSizing={false}
                ref={bottomSheetRef}
                index={0}
                snapPoints={['100%']}
                enablePanDownToClose
                style={styles.bottomSheet}
              >
                <View style={styles.bottomSheetContent}>
                  <Text>Test</Text>
                </View>
              </BottomSheet>
            </View>
          }
          ListFooterComponentStyle={styles.footerStyle}
          onEndReached={handleShowMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text>No events found</Text>
            </View>
          }
        />
      </View>
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
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  footerContainer: {
    flex: 1,
  },
  footerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-end',
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
    backgroundColor: '#f5f5f5',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});