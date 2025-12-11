import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import UpcomingGuestItem from '../../components/Common/UpcomingGuestItem';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import residentGuestService, {
  ResidentGuest,
} from '../../services/residentGuestService';
import {normalize} from '../../lib/normalize';

const UpcomingGuestsTab = () => {
  const navigation = useNavigation();
  const [guests, setGuests] = useState<ResidentGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create fetchGuests function with useCallback to prevent unnecessary re-renders
  const fetchGuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await residentGuestService.getAllResidentGuests({
        populate: ['resident', 'resident.user', 'resident.estate'],
        filters: {
          status: {
            $in: ['pending', 'arrived'], // Only upcoming guests
          },
        },
        sort: ['updatedAt:desc'],
      });

      setGuests(normalize(response.data));
    } catch (err: any) {
      console.error('Error fetching guests:', err);
      setError('Failed to load guests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch guests when screen comes into focus (including initial mount and returning from other screens)
  useFocusEffect(
    useCallback(() => {
      fetchGuests();
    }, [fetchGuests]),
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchGuests();
    } finally {
      setRefreshing(false);
    }
  }, [fetchGuests]);

  // Transform guest data to match UpcomingGuestItem expected format
  const transformedGuests = guests.map(guest => ({
    id: guest.id,
    name: guest.name,
    date: guest.arrivalTime,
    purpose: guest.purpose,
    vehiclePlate: guest.vehicleLicensePlate || '',
    status: guest.status,
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading guests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (transformedGuests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No upcoming guests</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transformedGuests}
        renderItem={({item, index}) => (
          <UpcomingGuestItem
            guest={item}
            index={index}
            onPressItem={() => {
              (navigation as any).navigate('ViewResidentGuest', {
                guestId: item.id,
              });
            }}
          />
        )}
        keyExtractor={item => item.id}
        // ItemSeparatorComponent={ItemSeparator} // Removed separator as cards have margin
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background for card contrast
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
});

export default UpcomingGuestsTab;
