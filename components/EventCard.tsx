import { Nejat } from '@/types/nejat';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EventCard = ({ event }: {event: Nejat}) => {
  const eventDate = new Date(event.eventDate);
  const month = eventDate.toLocaleString('default', { month: 'short' });
  const day = eventDate.getDate();
  const year = eventDate.getFullYear();
  
  const performerName = (performer: any) => 
    performer.nickname || `${performer.firstName} ${performer.lastName}`;

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
    //   onPress={() => onPress(event.id)}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            style={styles.imageGradient}
          >
            <Image
              source={{ uri: event.imageUrl || event.venue.imageUrl || 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=' }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />

            {/* Date Badge */}
            <View style={styles.dateBadge}>
              <Text style={styles.dateDay}>{day}</Text>
              <Text style={styles.dateMonth}>{month}</Text>
              <Text style={styles.dateYear}>{year}</Text>
            </View>

            {/* City Badge */}
            <View style={styles.cityBadge}>
              <MaterialIcons name="location-on" size={14} color="white" />
              <Text style={styles.cityText}>{event.venue.city}</Text>
            </View>

            {/* Venue Badge */}
            <View style={styles.venueBadge}>
              <FontAwesome name="star" size={12} color="white" />
              <Text style={styles.venueText}>{event.venue.name}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Venue Info */}
          <View style={styles.venueInfo}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {event.name || `${event.venue.name} - Event`}
            </Text>
            <View style={styles.addressContainer}>
              <MaterialIcons name="location-on" size={16} color="#9ca3af" />
              <Text style={styles.addressText} numberOfLines={2}>
                {event.venue.address}
              </Text>
            </View>
          </View>

          {/* Performers */}
          {event.performers && event.performers.length > 0 && (
            <View style={styles.performersContainer}>
              <View style={styles.performersTitle}>
                <Feather name="users" size={16} color="#9ca3af" />
                <Text style={styles.performersTitleText}>Performers</Text>
              </View>
              <View style={styles.performersList}>
                {event.performers.map((performer) => (
                  <View key={performer.id} style={styles.performerBadge}>
                    <Text style={styles.performerText}>
                      {performerName(performer)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Button */}
          <View style={styles.buttonContainer}>
            <LinearGradient
              colors={['#f59e0b', '#eab308']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>View Details</Text>
              <Feather name="arrow-right" size={18} color="white" />
            </LinearGradient>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    backgroundColor: 'white',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  card: {
    flex: 1,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  imageGradient: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  dateBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateDay: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  dateMonth: {
    fontSize: 10,
    color: '#111827',
  },
  dateYear: {
    fontSize: 10,
    color: '#4b5563',
  },
  cityBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(234, 179, 8, 0.95)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cityText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginLeft: 4,
  },
  venueBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(234, 179, 8, 0.95)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  venueText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginLeft: 4,
  },
  contentContainer: {
    padding: 16,
    flex: 1,
  },
  venueInfo: {
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
    flex: 1,
  },
  performersContainer: {
    marginBottom: 16,
  },
  performersTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  performersTitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 4,
  },
  performersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  performerBadge: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  performerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400e',
  },
  buttonContainer: {
    marginTop: 'auto',
    alignItems: 'flex-end',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    marginRight: 8,
  },
});

export default EventCard;