import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import UpcomingGuestItem from '../Common/UpcomingGuestItem';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import residentGuestService, {
  ResidentGuest,
} from '../../services/residentGuestService';
import {normalize} from '../../lib/normalize';

const ItemSeparator = () => <View style={styles.separator} />;

const UpcomingGuests = () => {
  const navigation = useNavigation();
  const [guests, setGuests] = useState<ResidentGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch upcoming guests (top 5, sorted by updated_at)
  const fetchUpcomingGuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await residentGuestService.getAllResidentGuests({
        populate: ['resident', 'resident.user'],
        filters: {
          status: {
            $in: ['pending', 'arrived'], // Only upcoming guests
          },
        },
        sort: ['updatedAt:desc'],
        pagination: {
          page: 1,
          pageSize: 5,
        },
      });

      setGuests(normalize(response.data));
    } catch (err: any) {
      console.error('Error fetching upcoming guests:', err);
      setError('Failed to load upcoming guests.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch guests when component comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUpcomingGuests();
    }, [fetchUpcomingGuests]),
  );

  // Transform guest data to match UpcomingGuestItem expected format
  const transformedGuests = guests.map(guest => ({
    id: guest.id,
    name: guest.name,
    date: guest.arrivalTime,
    purpose: guest.purpose,
    vehiclePlate: guest.vehicleLicensePlate || 'N/A',
    status: guest.status,
  }));

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Upcoming</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading guests...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Upcoming</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (transformedGuests.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Upcoming</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No upcoming guests</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming</Text>
      <FlatList
        data={transformedGuests}
        renderItem={({item}) => (
          <UpcomingGuestItem
            guest={item}
            onPressItem={() => {
              (navigation as any).navigate('ViewResidentGuest', {
                guestId: item.id,
              });
            }}
          />
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.semibold,
    fontWeight: '400',
    color: colors.darkFont,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  listContent: {
    paddingHorizontal: 18,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginLeft: 8,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
  },
});

export default UpcomingGuests;
