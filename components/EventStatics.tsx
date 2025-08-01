import { Feather, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import DynamicEventData from './DynamicEventData';
// import AddReservationsForm from './AddReservationsForm';
import { Nejat, Venue } from '@/types/nejat';
import { useRouter } from 'expo-router';

const EventStatics = ({ id, event }: { id: string; event: Nejat }) => {
  const router = useRouter();
  return (
    <LinearGradient colors={['#FFFFF0', '#FFFFFF', '#FFFFF0']} style={{ flex: 1 }}>
      <View style={{ position: 'relative' }} className='bg-red-500'>
        {/* Hero Image */}
        <View className='min-h-full max-h-[200px] min-w-full max-w-[300px] overflow-hidden'>
          <Image
            source={{ uri: event.imageUrl || event.venue.imageUrl }}
            style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            accessibilityLabel={event.venue.name}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          />

          {/* Back Button */}
          <View style={{ position: 'absolute', top: 50, left: 12, zIndex: 10 }}>
            <TouchableOpacity
              accessibilityLabel="Back to events"
              onPress={() => router.back()}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 20,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Feather name="arrow-left" color="white" size={20} />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={{ position: 'absolute', top: 50, right: 12, zIndex: 10, flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#facc15',
                borderRadius: 20,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Feather name="share-2" color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#facc15',
                borderRadius: 20,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Feather name="heart" color="white" size={20} />
            </TouchableOpacity>
          </View>

          {/* Hero Content */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 }}>
            <View style={{ gap: 8 }}>
              {/* Event Badge */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: '#facc15',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 20,
                  alignSelf: 'flex-start',
                }}
              >
                <Feather name="star" color="#713f12" size={16} />
                <Text style={{ color: '#713f12', fontSize: 12, fontWeight: '500' }}>Featured Event</Text>
              </View>

              {/* Venue Name */}
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', lineHeight: 28 }}>{event.venue.name}</Text>

              {/* Quick Info */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name="calendar" color="rgba(255,255,255,0.9)" size={16} />
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>
                    {new Date(event.eventDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                {event.startTime && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Feather name="clock" color="rgba(255,255,255,0.9)" size={16} />
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>
                      {new Date(event.startTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View
          style={{
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            borderBottomWidth: 1,
            borderBottomColor: '#fef08a',
          }}
        >
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ca8a04' }}>{event.performers.length}</Text>
                  <Text style={{ fontSize: 12, color: '#4b5563' }}>Performers</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ca8a04' }}>{event.venue.city}</Text>
                  <Text style={{ fontSize: 12, color: '#4b5563' }}>Location</Text>
                </View>
              </View>
              <View style={{ flexShrink: 1 }}>
                {/* <AddReservationsForm venue={event.venue} event={event} /> */}
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={{ padding: 16 }} className='mb-4'>
        <View style={{ gap: 16 }}>
          <DynamicEventData id={id}/>
          <VenueInfo venue={event.venue} event={event} />
        </View>
      </View>
    </LinearGradient>
  );
};

const VenueInfo = ({ venue, event }: { venue: Venue; event: Nejat }) => {
  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#fef08a',
        padding: 16,
        position: 'sticky',
        top: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: '#fef9c3',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Feather name="map-pin" color="#d97706" size={24} />
        </View>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Venue Information</Text>
          <Text style={{ fontSize: 12, color: '#4b5563' }}>Get in touch & find us</Text>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        {/* Address */}
        <View style={{ backgroundColor: '#fef9c3', borderRadius: 12, padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <Feather name="map-pin" color="#d97706" size={20} style={{ marginTop: 4 }} />
            <View>
              <Text style={{ color: '#111827', fontWeight: '500', fontSize: 14 }}>{venue.address}</Text>
              <Text style={{ color: '#4b5563', fontSize: 12 }}>{venue.city}</Text>
            </View>
          </View>
        </View>

        {/* Phone */}
        {venue.phoneNumber && (
          <View style={{ backgroundColor: '#fef9c3', borderRadius: 12, padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Feather name="phone" color="#d97706" size={20} />
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${venue.phoneNumber}`)}>
                <Text style={{ color: '#111827', fontWeight: '500', fontSize: 14 }}>{venue.phoneNumber}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Website */}
        {venue.socialMedia.website && (
          <View style={{ backgroundColor: '#fef9c3', borderRadius: 12, padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Feather name="globe" color="#d97706" size={20} />
              <TouchableOpacity onPress={() => openLink(venue.socialMedia.website as string)}>
                <Text style={{ color: '#111827', fontWeight: '500', fontSize: 14 }}>Visit Website</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Social Media */}
        {(venue.socialMedia.facebook || venue.socialMedia.instagram) && (
          <View style={{ backgroundColor: '#fef9c3', borderRadius: 12, padding: 12 }}>
            <Text style={{ fontSize: 12, color: '#4b5563', marginBottom: 12 }}>Follow us</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {venue.socialMedia.facebook && (
                <TouchableOpacity
                  onPress={() => openLink(`https://facebook.com/${venue.socialMedia.facebook}`)}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#3b5998',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FontAwesome name="facebook" color="white" size={20} />
                </TouchableOpacity>
              )}
              {venue.socialMedia.instagram && (
                <TouchableOpacity
                  onPress={() => openLink(`https://instagram.com/${venue.socialMedia.instagram}`)}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#E1306C',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Feather name="instagram" color="white" size={20} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default EventStatics;
