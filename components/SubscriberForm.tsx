import { api } from '@/lib/api';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { zodResolver } from '@hookform/resolvers/zod';
import Checkbox from "expo-checkbox";
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const SubscribeForm = ({ venueId }: {venueId: string}) => {
  const [addNumberToo, setAddNumberToo] = useState(false);

  const subscribeFormSchema = z.object({
    email: z.email(),
    phoneNumber: z.string().optional(),
  });

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<z.infer<typeof subscribeFormSchema>>({
    resolver: zodResolver(subscribeFormSchema),
    defaultValues: {
      email: "",
      phoneNumber: ""
    },
    mode: "onChange"
  });

  const onSubmit = async (data: z.infer<typeof subscribeFormSchema>) => {
    try {
      const response = await api.post(`/subscribers/createSubscription`, {
        email: data.email, 
        venueId: venueId, 
        ...(addNumberToo && { phoneNumber: data.phoneNumber })
      });
      
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Subscription Successful',
          text2: 'You will be notified about future events'
        });
        reset();
      }
    } catch(error: any) {
        console.log(error.response.data);
        
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again!'
      });
    }
  };

  return (
    <View style={{ width: '100%', maxWidth: 400 }}>
      {/* Header */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <View style={{ 
          width: 64, 
          height: 64, 
          backgroundColor: '#fef9c3', 
          borderRadius: 32, 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: 16
        }}>
        <FontAwesome name="bell" size={24} color="#d97706" />
        </View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>Stay Updated</Text>
        <Text style={{ fontSize: 14, color: '#4b5563' }}>Get notified about upcoming events and exclusive offers</Text>
      </View>

      {/* WhatsApp Toggle */}
      <View style={{ marginBottom: 16 }}>   
        <TouchableOpacity 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 12, 
            padding: 12, 
            backgroundColor: '#fef9c3', 
            borderRadius: 12, 
            borderWidth: 1,
            borderColor: '#fef08a'
          }}
          onPress={() => Toast.show({
            type: 'info',
            text1: 'Coming soon!',
            text2: 'WhatsApp notifications will be available soon'
          })}
        >
          <Checkbox
            onValueChange={() => Toast.show({
              type: 'info',
              text1: 'Coming soon!',
              text2: 'WhatsApp notifications will be available soon'
            })}
            style={{ 
              borderColor: '#facc15',
              backgroundColor: addNumberToo ? '#facc15' : 'transparent'
            }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <AntDesign name="message1" size={20} color="#25D366" />
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#111827' }}>Also notify via WhatsApp</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Subscribe Form */}
      <View style={{ gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151' }}>Email Address</Text>
          <Controller 
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: 'white', 
                borderRadius: 12,
                borderWidth: 1,
                borderColor: errors.email ? '#ef4444' : '#e5e7eb',
                paddingHorizontal: 12
              }}>
                <AntDesign name="mail" size={24} color="#9ca3af" />
                <TextInput
                  placeholder="your@email.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={{ flex: 1, height: 48, color: '#111827', paddingLeft: 6 }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}
          />
          {errors.email && (
            <Text style={{ color: '#ef4444', fontSize: 12 }}>{errors.email.message}</Text>
          )}
        </View>

        {addNumberToo && (
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151' }}>WhatsApp Number</Text>
            <View style={{ position: 'relative' }}>
              <View style={{ 
                position: 'absolute', 
                left: 12, 
                top: 12, 
                zIndex: 1 
              }}>
                <AntDesign name="message1" size={20} color="#25D366" />
              </View>
              <Controller 
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="+383044123123"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={{ 
                      backgroundColor: 'white', 
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: errors.phoneNumber ? '#ef4444' : '#e5e7eb',
                      paddingLeft: 40,
                      height: 48,
                      color: '#111827'
                    }}
                    keyboardType="phone-pad"
                  />
                )}
              />
            </View>
            {errors.phoneNumber && (
              <Text style={{ color: '#ef4444', fontSize: 12 }}>{errors.phoneNumber.message}</Text>
            )}
          </View>
        )}

        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={{ 
            backgroundColor: '#eab308',
            borderRadius: 12,
            paddingVertical: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
          }}
        >
          {isSubmitting ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ 
                width: 16, 
                height: 16, 
                borderWidth: 2, 
                borderColor: 'white', 
                borderTopColor: 'transparent', 
                borderRadius: 8 
              }} />
              <Text>Subscribing...</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Entypo name="chevron-right" size={16} color="white" />
              <Text>Subscribe Now</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(SubscribeForm);