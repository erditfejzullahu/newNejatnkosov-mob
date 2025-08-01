import { Feather, FontAwesome } from '@expo/vector-icons';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { useScroll } from '@/context/scroll-context';
import { api } from '@/lib/api';
import { Performer } from '@/types/nejat';
import LoadingClientComponent from './LoadingClientComponent';

type PerformerCardProps = {
  performer: Performer;
};

const PerformerCard = React.memo(({ performer }: PerformerCardProps) => {
  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: performer.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            accessibilityLabel={performer.nickname}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text style={styles.nickname} numberOfLines={1}>{performer.nickname}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="star" color="#ca8a04" size={16} />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          </View>
          <Text style={styles.nameText}>
            {performer.firstName} {performer.lastName}
          </Text>
          <Text style={styles.bioText} numberOfLines={3}>{performer.bio}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {performer.socialMedia.twitter && (
              <TouchableOpacity
                onPress={() => openLink(`https://twitter.com/${performer.socialMedia.twitter}`)}
                style={[styles.iconButton, { backgroundColor: '#1DA1F2' }]}
              >
                <Feather name="twitter" color="white" size={16} />
              </TouchableOpacity>
            )}
            {performer.socialMedia.instagram && (
              <TouchableOpacity
                onPress={() => openLink(`https://instagram.com/${performer.socialMedia.instagram}`)}
                style={[styles.iconButton, { backgroundColor: '#E1306C' }]}
              >
                <Feather name="instagram" color="white" size={16} />
              </TouchableOpacity>
            )}
            {performer.socialMedia.facebook && (
              <TouchableOpacity
                onPress={() => openLink(`https://facebook.com/${performer.socialMedia.facebook}`)}
                style={[styles.iconButton, { backgroundColor: '#3b5998' }]}
              >
                <FontAwesome name="facebook" color="white" size={16} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
});

type DateTimeDisplayProps = {
  label: string;
  value: Date;
  formatFn: (date: Date) => string;
  icon: React.ReactNode;
};

const DateTimeDisplay = React.memo(({ label, value, formatFn, icon }: DateTimeDisplayProps) => (
  <View style={styles.dateBox}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <View style={styles.dateIconWrapper}>{icon}</View>
      <Text style={styles.labelText}>{label}</Text>
    </View>
    <Text style={styles.valueText}>{formatFn(new Date(value))}</Text>
  </View>
));

type DynamicEventDataContentProps = {
  id: string;
};

const DynamicEventDataContent = React.memo(({ id }: DynamicEventDataContentProps) => {
  const { data: event } = useSuspenseQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/nejat/${id}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const {scrollToFooter} = useScroll();

  return (
    <View style={{ gap: 16 }}>
      {/* About Event Section */}
      <View style={styles.card}>
        <View style={{ position: 'absolute', right: 12, top: 12 }}>
          <TouchableOpacity
            onPress={scrollToFooter}
            style={styles.subscribeButton}
            className='items-center'
            // textStyle={styles.subscribeText}
          >
            <Text className='text-white'>Subscribe</Text>
            <Feather name="chevron-down" color="white" size={16} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.iconCircle}>
            <Feather name="music" color="#d97706" size={24} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>About the Event</Text>
            <Text style={styles.sectionSubtitle}>What to expect</Text>
          </View>
        </View>

        <Text style={styles.description}>{event.description}</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <DateTimeDisplay
            label="Event Date"
            value={event.eventDate}
            formatFn={(date) =>
              date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' })
            }
            icon={<Feather name="calendar" color="#d97706" size={16} />}
          />
          {event.startTime && (
            <DateTimeDisplay
              label="Start Time"
              value={event.startTime}
              formatFn={(date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              icon={<Feather name="clock" color="#d97706" size={16} />}
            />
          )}
          {event.endTime && (
            <DateTimeDisplay
              label="End Time"
              value={event.endTime}
              formatFn={(date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              icon={<Feather name="clock" color="#d97706" size={16} />}
            />
          )}
        </View>
      </View>

      {/* Performers Section */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.iconCircle}>
            <Feather name="users" color="#d97706" size={24} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Performers</Text>
            <Text style={styles.sectionSubtitle}>{event.performers.length} amazing artists</Text>
          </View>
        </View>

        <View style={{ gap: 16 }}>
          {event.performers.map((performer: Performer) => (
            <PerformerCard key={performer.id} performer={performer} />
          ))}
        </View>
      </View>
    </View>
  );
});

const DynamicEventData = React.memo(({ id }: { id: string }) => (
  <React.Suspense fallback={
    <LoadingClientComponent />
  }>
    <DynamicEventDataContent id={id} />
  </React.Suspense>
));

export default DynamicEventData;

const styles: Record<string, ViewStyle | any> = {
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#fef08a',
    padding: 16
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fef08a'
  },
  nickname: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827'
  },
  featuredText: {
    fontSize: 12,
    color: '#ca8a04',
    fontWeight: '500'
  },
  nameText: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 8,
    fontWeight: '500'
  },
  bioText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 18
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateBox: {
    backgroundColor: '#fef9c3',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fef08a'
  },
  dateIconWrapper: {
    width: 32,
    height: 32,
    backgroundColor: '#fef08a',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563'
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827'
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  iconCircle: {
    width: 48,
    height: 48,
    backgroundColor: '#fef9c3',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827'
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#4b5563'
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16
  },
  subscribeButton: {
    backgroundColor: '#eab308',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  subscribeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500'
  },
  fallbackStyle: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fef08a'
  }
};
