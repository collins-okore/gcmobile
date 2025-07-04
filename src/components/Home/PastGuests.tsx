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
import PastGuestItem from '../Common/PastGuestItem';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import residentGuestService, {
  ResidentGuest,
} from '../../services/residentGuestService';

const ItemSeparator = () => <View style={styles.separator} />;

const PastGuests = () => {
  const navigation = useNavigation();
  const [pastGuests, setPastGuests] = useState<ResidentGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch past guests (top 5, sorted by updated_at)
  const fetchPastGuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await residentGuestService.getAllResidentGuests({
        populate: ['resident', 'estate'],
        filters: {
          status: {
            in: ['cancelled', 'departed'], // Only past guests
          },
        },
        sort: {
          updated_at: 'desc',
        },
        pagination: {
          page: 1,
          pageSize: 5,
        },
      });

      setPastGuests(response.data);
    } catch (err: any) {
      console.error('Error fetching past guests:', err);
      setError('Failed to load past guests.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch guests when component comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPastGuests();
    }, [fetchPastGuests]),
  );

  // Transform guest data to match PastGuestItem expected format
  const transformedData = pastGuests.map(guest => ({
    id: guest.id,
    name: guest.name,
    date: guest.departure_time || guest.updated_at,
    purpose: guest.purpose,
    vehicle_plate: guest.vehicle_license_plate || '',
  }));

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Guest History</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Guest History</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (transformedData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Guest History</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No past guests</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guest History</Text>
      <FlatList
        data={transformedData}
        renderItem={({item}) => (
          <PastGuestItem
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
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.semibold,
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

export default PastGuests;
