import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import UpcomingGuestItem from '../../../components/Guests/UpcomingGuestItem';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import securityGuardGuestService, {
  SecurityGuardGuest,
} from '../../../services/securityGuardGuestService';
import {normalize} from '../../../lib/normalize';

const ItemSeparator = () => <View style={styles.separator} />;

const UpcomingGuestsTab = () => {
  const navigation = useNavigation();
  const [guests, setGuests] = useState<SecurityGuardGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create fetchGuests function with useCallback to prevent unnecessary re-renders
  const fetchGuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await securityGuardGuestService.getAllGuests({
        populate: ['resident'],
        filters: {
          status: {
            $in: ['pending', 'arrived'], // Only upcoming guests
          },
        },
        sort: ['updatedAt:desc'],
        pagination: {
          page: 1,
          pageSize: 100,
        },
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
    ...guest,
    id: guest.id,
    name: guest.name,
    date: guest.arrivalTime,
    purpose: guest.purpose,
    vehiclePlate: guest.vehicleLicensePlate || 'N/A',
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
        renderItem={({item}) => {
          return (
            <UpcomingGuestItem
              guest={item}
              onPressItem={() => {
                (navigation as any).navigate('ViewSecurityGuardGuest', {
                  guestId: item.id,
                });
              }}
            />
          );
        }}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={ItemSeparator}
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
    backgroundColor: colors.whiteBg,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  listContent: {
    paddingHorizontal: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.whiteBg,
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
    backgroundColor: colors.whiteBg,
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
    backgroundColor: colors.whiteBg,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
});

export default UpcomingGuestsTab;
