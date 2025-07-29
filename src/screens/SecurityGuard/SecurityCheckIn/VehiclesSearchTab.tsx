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
import securityGuardGuestService from '../../../services/securityGuardGuestService';
import {normalize} from '../../../lib/normalize';
import {useNavigation, useIsFocused} from '@react-navigation/native';

interface VehiclesSearchTabProps {
  searchQuery: string;
}

// Vehicle Item Component
const VehicleItem = ({
  item,
  onPress,
}: {
  item: any;
  onPress: (vehicleId: string) => void;
}) => (
  <TouchableOpacity style={styles.itemCard} onPress={() => onPress(item.id)}>
    <View style={styles.avatar}>
      <Icon name="car" size={24} color={colors.grayFont} />
    </View>
    <View style={styles.itemContent}>
      <Text style={styles.itemName}>{item.licensePlate}</Text>
      <Text style={styles.itemDetail}>
        {item.make} {item.model}
      </Text>
      <Text style={styles.itemDetail}>Color: {item.color}</Text>
      {item.resident && (
        <>
          <Text style={styles.itemDetail}>
            Owner:{' '}
            {item.resident.user
              ? `${item.resident.user.firstName} ${item.resident.user.lastName}`
              : 'N/A'}
          </Text>
          <Text style={styles.itemDetail}>
            House: {item.resident.houseNumber}
            {item.resident.unit ? `, Unit ${item.resident.unit}` : ''}
          </Text>
        </>
      )}
    </View>
    <Icon name="chevron-right" size={20} color={colors.grayFont} />
  </TouchableOpacity>
);

const VehiclesSearchTab: React.FC<VehiclesSearchTabProps> = ({searchQuery}) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const handleVehiclePress = (vehicleId: string) => {
    console.log('vehicleId', vehicleId);
    console.log('navigation', navigation);
    // (navigation as any).navigate('ViewSecurityGuardVehicle', {vehicleId});
  };

  const loadVehicles = useCallback(async (query?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const andConditions: any = [];
      if (query && query.trim()) {
        const searchTerm = query.trim();
        andConditions.push({
          $or: [
            {licensePlate: {$containsi: searchTerm}},
            {make: {$containsi: searchTerm}},
            {model: {$containsi: searchTerm}},
            {resident: {houseNumber: {$containsi: searchTerm}}},
            {resident: {blockCourt: {$containsi: searchTerm}}},
            // {resident: {user: {firstName: {$containsi: searchTerm}}}},
            // {resident: {user: {lastName: {$containsi: searchTerm}}}},
          ],
        });
      }
      const response = await securityGuardGuestService.getEstateVehicles({
        pagination: {
          page: 1,
          pageSize: 50,
        },
        sort: ['updatedAt:desc'],
        filters: andConditions.length > 0 ? {$and: andConditions} : {},
        populate: ['resident', 'resident.user'],
      });
      setVehicles(normalize(response.data));
    } catch (err: any) {
      console.error('Error loading vehicles:', err);
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFocused) return;
    const timeoutId = setTimeout(() => {
      loadVehicles(searchQuery);
    }, 300); // Debounce search for 300ms
    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadVehicles, isFocused]);

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Loading vehicles...</Text>
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
            onPress={() => loadVehicles(searchQuery)}>
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
            No vehicles found for '{searchQuery}'
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Icon name="car" size={48} color={colors.grayFont} />
        <Text style={styles.emptyText}>No vehicles found</Text>
        <Text style={styles.emptySubtext}>
          Try searching for license plates, vehicle details, or owner
          information
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={vehicles}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <VehicleItem
            item={item}
            onPress={() => {
              handleVehiclePress(item.id);
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshing={isLoading}
        onRefresh={() => loadVehicles(searchQuery)}
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
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.whiteBg,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 2,
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

export default VehiclesSearchTab;
