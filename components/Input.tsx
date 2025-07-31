// import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface ExpoInputProps extends TextInputProps {
  label?: string;
//   iconName?: keyof typeof MaterialIcons.glyphMap;
  containerClass?: string;
  inputClass?: string;
  labelClass?: string;
}

const Input: React.FC<ExpoInputProps> = ({
  label,
//   iconName,
  containerClass = '',
  inputClass = '',
  labelClass = '',
  ...props
}) => {
  return (
    <View className={`mb-4 w-full ${containerClass}`}>
      {label && (
        <Text className={`mb-2 text-sm font-medium text-gray-700 ${labelClass}`}>
          {label}
        </Text>
      )}
      
      <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
        {/* {iconName && (
          <MaterialIcons 
            name={iconName} 
            size={20} 
            className="text-gray-500 mr-2"
          />
        )} */}
        <TextInput
          className={`flex-1 h-12 text-base text-gray-900 ${inputClass}`}
          placeholderTextColor="#9CA3AF" // gray-400
          {...props}
        />
      </View>
    </View>
  );
};

export default Input;