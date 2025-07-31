import Header from "@/components/Header";
import { api } from "@/lib/api";
import { KosovoCity, Nejat } from "@/types/nejat";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../assets/global.css";

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
  }, [data]);

  const allEvents = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data])

  const showLoading = isLoading && !data;
  const showEmptyState = allEvents.length === 0 && !isLoading;

  return (
    <SafeAreaView>
      <FlatList 
        className="flex-1 bg-white"
        data={[]}
        renderItem={({item}) => (
          <View>asd</View>
        )}
        ListHeaderComponent={() => (
          <Header onSearch={setSearch} onCityChange={setCity} onDateRangeChange={(start, end) => setDateRange({ start, end })} />
        )}
      />
    </SafeAreaView>
  );
}
