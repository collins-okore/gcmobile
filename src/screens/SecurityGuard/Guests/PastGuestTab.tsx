import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import PastGuestItem from '../../../components/Guests/PastGuestItem';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import securityGuardGuestService, {
  SecurityGuardGuest,
} from '../../../services/securityGuardGuestService';

const ItemSeparator = () => <View style={styles.separator} />;

const PastGuestTab = () => {
  const navigation = useNavigation();
  const [pastGuests, setPastGuests] = useState<SecurityGuardGuest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create fetchPastGuests function with useCallback
  const fetchPastGuests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await securityGuardGuestService.getAllGuests({
        populate: ['resident'],
        filters: {
          status: {$in: ['cancelled', 'departed']},
        },
        sort: ['updatedAt:desc'],
        pagination: {
          page: 1,
          pageSize: 100,
        },
      });

      setPastGuests(response.data);
    } catch (err: any) {
      console.error('Error fetching past guests:', err);
      setError('Failed to load past guests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch past guests when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPastGuests();
    }, [fetchPastGuests]),
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchPastGuests();
    } finally {
      setRefreshing(false);
    }
  }, [fetchPastGuests]);

  // Transform data for PastGuestItem component
  const transformedData = pastGuests.map(guest => ({
    ...guest,
    id: guest.id,
    name: guest.name,
    date: guest.departureTime || guest.updatedAt,
    purpose: guest.purpose,
    vehiclePlate: guest.vehicleLicensePlate || '',
  }));

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading past guests...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Empty state
  if (transformedData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No past guests found</Text>
        <Text style={styles.emptySubtext}>
          Cancelled or departed guests will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transformedData}
        renderItem={({item}) => (
          <PastGuestItem
            guest={item}
            onPressItem={() => {
              (navigation as any).navigate('ViewSecurityGuardGuest', {
                guestId: item.id,
              });
            }}
          />
        )}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.whiteBg,
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#FF6B6B',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PastGuestTab;
