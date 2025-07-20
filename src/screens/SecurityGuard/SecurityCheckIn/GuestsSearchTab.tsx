import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from '../../../components/Common/Icon';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import {CalendarIcon} from 'react-native-heroicons/solid';
import {format, isThisYear} from 'date-fns';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import securityGuardGuestService, {
  SecurityGuardGuest,
} from '../../../services/securityGuardGuestService';
import {normalize} from '../../../lib/normalize';

interface GuestsSearchTabProps {
  searchQuery: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const time = format(date, 'HH:mm');

  // If it's this year, don't show the year
  if (isThisYear(date)) {
    return `${format(date, 'do MMM')} · ${time}`; // e.g., "1st Jun · 12:28"
  }

  return `${format(date, 'dd MMM yyyy')} · ${time}`; // e.g., "13 May 2022 · 13:30"
};

// Guest Item Component
const GuestItem = ({
  item,
  onPressItem,
}: {
  item: SecurityGuardGuest;
  onPressItem: (guestId: string) => void;
}) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => onPressItem(item.id)}>
    <View style={styles.left}>
      <View style={styles.avatar}>
        <CalendarIcon color={colors.grayIconColor} size={26} />
      </View>
      <View style={styles.details}>
        <Text style={styles.date}>{formatDate(item.arrivalTime)}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.purpose}>{item.purpose}</Text>
        {item.resident && (
          <Text style={styles.apartment}>
            {item.resident.houseNumber}
            {item.resident.unit ? `, Unit ${item.resident.unit}` : ''}
          </Text>
        )}
      </View>
    </View>
    <View style={styles.right}>
      {item.vehicleLicensePlate && (
        <View style={styles.plateContainer}>
          <Text style={styles.vehiclePlate}>{item.vehicleLicensePlate}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const ItemSeparator = () => <View style={styles.separator} />;

const GuestsSearchTab: React.FC<GuestsSearchTabProps> = ({searchQuery}) => {
  const [guests, setGuests] = useState<SecurityGuardGuest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const loadGuests = useCallback(async (query?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Build filters based on search query
      // const filters: any = {};
      const andConditions: any = [];

      if (query && query.trim()) {
        const searchTerm = query.trim();

        // Search across multiple fields using OR condition
        // filters.$and = [
        //   {
        //     $or: [
        //       {
        //         name: {
        //           $contains: searchTerm,
        //         },
        //       },
        //       {
        //         phone: {
        //           $contains: searchTerm,
        //         },
        //       },
        //       {
        //         vehicleLicensePlate: {
        //           $contains: searchTerm,
        //         },
        //       },
        //       {
        //         resident: {
        //           houseNumber: {
        //             $contains: searchTerm,
        //           },
        //         },
        //       },
        //       {
        //         resident: {
        //           blockCourt: {
        //             $contains: searchTerm,
        //           },
        //         },
        //       },
        //     ],
        //   },
        //   {
        //     status: {
        //       $in: ['pending', 'arrived'],
        //     },
        //   },
        // ];

        andConditions.push({
          $or: [
            {
              name: {$containsi: searchTerm},
            },
            {phone: {$containsi: searchTerm}},
            {vehicleLicensePlate: {$containsi: searchTerm}},
            {resident: {houseNumber: {$containsi: searchTerm}}},
            {resident: {blockCourt: {$containsi: searchTerm}}},
            // {resident: {user: {firstName: {$containsi: searchTerm}}}},
            // {resident: {user: {lastName: {$containsi: searchTerm}}}},
          ],
        });
      }
      andConditions.push({
        status: {$in: ['pending', 'arrived']},
      });

      const response = await securityGuardGuestService.getAllGuests({
        pagination: {
          page: 1,
          pageSize: 50,
        },

        sort: ['updatedAt:desc'],
        filters: {
          $and: andConditions,
        },
      });

      setGuests(normalize(response.data));
    } catch (err: any) {
      console.error('Error loading guests:', err);
      setError('Failed to load guests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reload guests when search query changes
  useEffect(() => {
    if (!isFocused) return;
    const timeoutId = setTimeout(() => {
      loadGuests(searchQuery);
    }, 300); // Debounce search for 300ms
    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadGuests, isFocused]);

  const handleGuestPress = (guestId: string) => {
    (navigation as any).navigate('ViewSecurityGuardGuest', {
      guestId: guestId,
    });
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Loading guests...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Icon name="exclamation-triangle" size={48} color="#FF6B6B" />
          <Text style={[styles.emptyText, {color: '#FF6B6B'}]}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadGuests(searchQuery)}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (searchQuery.trim()) {
      return (
        <View style={styles.emptyState}>
          <Icon name="search" size={48} color={colors.grayFont} />
          <Text style={styles.emptyText}>
            No guests found for '{searchQuery}'
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Icon name="users" size={48} color={colors.grayFont} />
        <Text style={styles.emptyText}>No guests found</Text>
        <Text style={styles.emptySubtext}>
          Try searching for guest names, phone numbers, or vehicle plates
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={guests}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <GuestItem item={item} onPressItem={handleGuestPress} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          guests.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={renderEmptyState}
        refreshing={isLoading}
        onRefresh={() => loadGuests(searchQuery)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
    paddingTop: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flexDirection: 'column',
    marginLeft: 16,
    flex: 1,
  },
  date: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 4,
  },
  purpose: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 2,
  },
  apartment: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  vehiclePlate: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  right: {
    alignItems: 'center',
  },
  plateContainer: {
    backgroundColor: colors.grayBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.whiteBg,
  },
});

export default GuestsSearchTab;
