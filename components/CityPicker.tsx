import { useCityDate } from '@/context/city-date-change-provider';
import { cities } from '@/data/cities';
import { KosovoCity } from '@/types/nejat';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated';

type CityTypes = {
    label: string;
    value: string;
}

const CityPicker = () => {
    const [cityTyped, setCityTyped] = useState("")
    const [showSelectCity, setShowSelectCity] = useState(false)

    const {city, setCity, dateRange, setDateRange, resetFilters} = useCityDate() 
    
    const filteredCities = cityTyped ? cities.filter((itm) => itm.label.includes(cityTyped)) : cities;

    const handleClickCities = useCallback((item: KosovoCity) => {
        setCity(item)
        setShowSelectCity(false)
    }, [])

    const handleFromDateChange = (event: DateTimePickerEvent, date?: Date) => {
        if (event.type === 'set' && date) { // Only update if user pressed "OK"
        if (date) {
            setDateRange((prevDateRange) => ({
            ...prevDateRange,
                start: date,
            }));
        }
        };
    }

    const handleToDateChange = (event: DateTimePickerEvent, date?: Date) => {
        if (event.type === 'set' && date) { // Only update if user pressed "OK"
        if (date) {
            setDateRange((prevDateRange) => ({
            ...prevDateRange,
                end: date,
            }));
        }
        };
    }

  return (
    <View className='w-full flex-col gap-4'>
    <View className='flex-col gap-2 w-full'>
        <View className='flex-row items-center'>
            <Entypo name="location-pin" size={20} color="#eab308" />
            <Text>City</Text>
        </View>
        <View className='relative'>
            <TouchableOpacity onPress={() => {setShowSelectCity(!showSelectCity); setCityTyped("")}} className='rounded-md border border-gray-200 px-4 py-2 bg-white'>
                <Text>{city === "ALL" ? 'Select a city' : city}</Text>
            </TouchableOpacity>

            {showSelectCity && <Animated.View entering={BounceIn.duration(500)} exiting={BounceOut.duration(500)}  className='absolute z-50 left-0 top-[30px]'>
                <ScrollView className='flex-col max-h-[100px] border bg-white rounded-md border-gray-200'>
                    <TextInput 
                        className='border mx-2 mt-2 p-2 border-gray-200 rounded-md'
                        placeholder='Your city...'
                        value={cityTyped}
                        onChangeText={(e) => setCityTyped(e)}
                    />

                    {filteredCities.length > 0 ? filteredCities.map((item, idx) => {
                        return (
                            <TouchableOpacity onPress={() => item.label === "ALL" ? setCity("ALL") : handleClickCities(item.value as KosovoCity)} key={item.value} className={`p-2 ${filteredCities.length !== idx + 1 && "border-b"} border-gray-200 mx-2`}>
                                <Text>{item.label}</Text>
                            </TouchableOpacity>
                        )})
                    : (
                        <TouchableOpacity className='p-2 mx-2' onPress={() => setCityTyped("")}>
                            <Text>No city found.</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </Animated.View>}
        </View>
    </View>
    <View className='flex-col gap-2 w-full'>
        <View className='flex-row gap-1 items-center'>
            <MaterialIcons name="date-range" size={20} color="#eab308" />
            <Text>Date Range</Text>
        </View>
        <View className='flex-row justify-between gap-2 flex-1'>
            <View className='flex-1 pl-1'>
                <View className='h-[20px]'>
                    <Text>From</Text>
                </View>
                <View className='-ml-2'>
                    <DateTimePicker 
                        testID='fromDate'
                        value={dateRange.start || new Date()}
                        mode="date"
                        style={{marginRight: "auto"}}
                        is24Hour
                        onChange={handleFromDateChange}
                    />
                </View>
            </View>
            <View className='flex-1'>
                <View className='h-[20px]'>
                    <Text>To</Text>
                </View>
                <View className='-ml-2'>
                    <DateTimePicker 
                        testID='fromDate'
                        value={dateRange.end || new Date()}
                        mode="date"
                        style={{marginRight: "auto"}}
                        is24Hour
                        onChange={handleToDateChange}
                    />
                </View>
            </View>
        </View>
    </View>
    </View>
  )
}

export default CityPicker