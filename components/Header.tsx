// import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cities } from '@/data/cities';
import { KosovoCity } from '@/types/nejat';
// import { Search, X } from 'lucide-react';
import { images } from '@/constants';
import { useBottomShelf } from '@/context/bottom-shelf-provider';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Input from './Input';

interface HeaderProps {
  onSearch: (query: string) => void;
  onCityChange: (city: KosovoCity | 'ALL') => void;
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

const Header = ({ onSearch, onCityChange, onDateRangeChange }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<KosovoCity | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const {toggle} = useBottomShelf();

  const handleCityChange = useCallback(
    (value: string) => {
      setSelectedCity(value as KosovoCity | 'ALL');
      onCityChange(value as KosovoCity | 'ALL');
    },
    [onCityChange]
  );

  const handleDateChange = useCallback(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    onDateRangeChange(start, end);
  }, [startDate, endDate, onDateRangeChange]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCity('ALL');
    setStartDate('');
    setEndDate('');
    onSearch('');
    onCityChange('ALL');
    onDateRangeChange(null, null);
  }, [onSearch, onCityChange, onDateRangeChange]);

  const hasActiveFilters = searchQuery || selectedCity !== 'ALL' || startDate || endDate;

  return (
    <View className="bg-white w-full">
      {/* Hero Section */}
      <View className="relative overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <View className="absolute inset-0 bg-white">
          <Image
            source={images.prishtinaPhoto}
            alt="Prishtina"
            style={{width: "100%", height: "100%"}}
            contentFit='cover'
          />
          {/* Dark gradient overlay for better readability */}
          <View className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </View>
        
        {/* Content */}
        <View className="relative px-4 py-20 pb-10">
          <View className="max-w-6xl mx-auto">
            {/* Logo and Title */}
            <View className="text-center mb-8">
              <View className="relative inline-block">
                {/* Decorative stars */}
                <View className="absolute -top-2 -left-4 text-yellow-400 animate-pulse">
                  <Svg width={24} height={24} fill="#facc15" viewBox="0 0 24 24">
                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </Svg>
                </View>
                {/* <View className="absolute -top-1 -right-4 text-yellow-300 animate-pulse" style={{animationDelay: '0.5s'}}> */}
                  <View className="absolute -top-1 -right-4 text-yellow-300 animate-pulse" >
                  <Svg width={20} height={20} fill="#facc15" viewBox="0 0 24 24">
                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </Svg>
                  </View>
                {/* <View className="absolute -bottom-2 left-1/4 text-yellow-500 animate-pulse" style={{animationDelay: '1s'}}> */}
                <View className="absolute -bottom-2 left-1/4 text-yellow-500 animate-pulse" >
                  <Svg width={16} height={16} fill="#facc15" viewBox="0 0 24 24">
                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </Svg>
                </View>
                {/* <View className="absolute -bottom-1 right-1/4 text-yellow-400 animate-pulse" style={{animationDelay: '1.5s'}}> */}
                <View className="absolute -bottom-1 right-1/4 text-yellow-400 animate-pulse">
                  <Svg width={12} height={12} className="w-3 h-3" fill="#facc15" viewBox="0 0 24 24">
                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </Svg>
                </View>
                
                <Text className="text-4xl text-center text-yellow-500 pointer-events-none md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text drop-shadow-lg relative z-10">
                  nejatnkosov.com
                </Text>
              </View>
              <Text className="text-lg md:text-xl text-gray-200 font-medium mt-4">
                Discover and explore events across Kosovo
              </Text>
            </View>

            {/* Search Bar - Mobile First */}
            <View className="mb-4">
              <View className="relative w-full max-w-2xl mx-auto">
                <Feather name="search" size={24} color={"#fff"} className='absolute z-50 top-3 left-2' />
                {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /> */}
                <Input
                  placeholder="Search events, venues, or performers..."
                  value={searchQuery}
                  onChangeText={(e) => {
                    setSearchQuery(e);
                    onSearch(e);
                  }}
                  containerClass='w-full'
                  inputClass='pl-10 pr-4 pb-4 py-3 bg-white/60 backdrop-blur-sm border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-yellow-400 focus:ring-yellow-400 transition-all duration-200 shadow-lg'
                />
              </View>
            </View>

            {/* filters */}
            <View className='justify-center mx-auto'>
              <TouchableOpacity onPress={() => toggle()} className='bg-white rounded-md flex-row items-center justify-center self-start px-4 py-1 gap-1'>
                  <Text>Filters</Text>
                  <AntDesign name="filter" size={24} color="black" />
              </TouchableOpacity>
            </View>
            {/* Filter Button - Mobile */}
            {/* <View className="flex justify-center mb-4"> */}
              {/* <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <TouchableOpacity
                    className="bg-white/95 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white hover:border-yellow-400 hover:text-yellow-600 transition-all duration-200 shadow-lg"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <View className="ml-2 h-2 w-2 bg-yellow-400 rounded-full" />
                    )}
                  </TouchableOpacity>
                </DrawerTrigger>
                <DrawerContent className="bg-white">
                  <DrawerHeader className="border-b">
                    <DrawerTitle className="text-gray-900 flex items-center justify-between">
                      <Text>Filter Events</Text>
                      {hasActiveFilters && (
                        <TouchableOpacity
                          onPress={clearFilters}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Clear
                        </TouchableOpacity>
                      )}
                    </DrawerTitle>
                  </DrawerHeader> */}
                  
                  {/* <View className="p-6 space-y-6"> */}
                    {/* City Filter */}
                    {/* <View className="space-y-2">
                      <Label>
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        City
                      </Label>
                      <Select value={selectedCity} onValueChange={handleCityChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </View> */}

                    {/* Date Range */}
                    {/* <View className="space-y-4">
                      <Label>
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        Date Range
                      </Label>
                      <View className="grid grid-cols-2 gap-3">
                        <View className="space-y-1">
                          <Label>Start Date</Label>
                          <Input
                            value={startDate}
                            onChangeText={(e) => {
                              setStartDate(e);
                              handleDateChange();
                            }}
                            className="text-sm"
                          />
                        </View>
                        <View className="space-y-1">
                          <Label>End Date</Label>
                          <Input
                            value={endDate}
                            onChangeText={(e) => {
                              setEndDate(e);
                              handleDateChange();
                            }}
                            className="text-sm"
                          />
                        </View>
                      </View>
                    </View> */}

                    {/* Active Filters Display */}
                    {/* {hasActiveFilters && (
                      <View className="pt-4 border-t">
                        <Text className="text-sm font-medium text-gray-700 mb-2">Active Filters:</Text>
                        <View className="flex flex-wrap gap-2">
                          {searchQuery && (
                            <Text className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              Search: {searchQuery}
                            </Text>
                          )}
                          {selectedCity !== 'ALL' && (
                            <Text className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              City: {cities.find(c => c.value === selectedCity)?.label}
                            </Text>
                          )}
                          {(startDate || endDate) && (
                            <Text className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              Date Range Set
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                  </View> */}
                {/* </DrawerContent>
              </Drawer> */}
            {/* </View> */}

            {/* Active Filters Summary - Desktop */}
            <View className="hidden md:block">
              {hasActiveFilters && (
                <View className="flex items-center justify-center gap-2 flex-wrap">
                  <Text className="text-sm text-gray-300">Active filters:</Text>
                  {searchQuery && (
                    <Text className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
                      {searchQuery}
                    </Text>
                  )}
                  {selectedCity !== 'ALL' && (
                    <Text className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                      {cities.find(c => c.value === selectedCity)?.label}
                    </Text>
                  )}
                  {(startDate || endDate) && (
                    <Text className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                      Date Range
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={clearFilters}
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                  >
                    <Fontisto name="close-a" size={24} color="black" />
                    <Text>Clear</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Header;