import EventStatics from '@/components/EventStatics';
import Footer from '@/components/Footer';
import LoadingClientComponent from '@/components/LoadingClientComponent';
import { useScroll } from '@/context/scroll-context';
import { api } from '@/lib/api';
import { Nejat } from '@/types/nejat';
import { useQuery } from '@tanstack/react-query';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const Neja = () => {
  const router = useRouter();

  const {scrollViewRef} = useScroll();
  const {eventId} = useLocalSearchParams();
  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ['event'],
    queryFn: async () => {
      try {
        const response = await api.get<Nejat>(`/nejat/${eventId}`)
        return response.data
      } catch (error) {
        console.error(error);
        router.push('/+not-found')
      }
    }
  })

  if(isLoading) return (
    <LoadingClientComponent />
  )
  if(isError) return (
    <View>
      <Text>Error</Text>
    </View>
  )

  if(!data) return (
    <Redirect href={'/+not-found'}/>
  )

  return (
    <ScrollView ref={scrollViewRef} className='w-full'>
      <EventStatics id={eventId as string} event={data}/>
      <Footer event={data}/>
    </ScrollView>
  )
}

export default Neja