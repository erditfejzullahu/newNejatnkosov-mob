import { Nejat } from '@/types/nejat';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import SubscriberForm from './SubscriberForm';

const Footer = ({ event }: {event: Nejat}) => {
  return (
    <LinearGradient 
      colors={['#eab308', '#ca8a04']}
      style={{ paddingVertical: 48 }}
    >
      <View style={{ maxWidth: 800, marginHorizontal: 'auto', paddingHorizontal: 16 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ 
            width: 64, 
            height: 64, 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            borderRadius: 32, 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: 16
          }}>
            <Feather name="mail" size={24} color="white" />
          </View>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>Stay in the Loop</Text>
          <Text style={{ fontSize: 16, color: '#fef9c3', textAlign: 'center' }}>
            Subscribe to get notified about upcoming events at {event.venue.name}
          </Text>
        </View>
        
        {/* Subscribe Form */}
        <View style={{ justifyContent: 'center' }}>
          <SubscriberForm venueId={event.venue.id} />
        </View>
        
        {/* Footer Info */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ fontSize: 14, color: '#fef9c3', textAlign: 'center' }}>
            Never miss an event again. Get exclusive updates and early access to reservations.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Footer;