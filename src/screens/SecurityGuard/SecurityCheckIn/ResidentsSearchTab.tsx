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

interface ResidentsSearchTabProps {
  searchQuery: string;
}

// Helper function to get initials
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Resident Item Component
const ResidentItem = ({
  item,
  onPress,
}: {
  item: any;
  onPress: (residentId: string) => void;
}) => (
  <TouchableOpacity
    style={styles.memberItem}
    activeOpacity={0.7}
    onPress={() => onPress(item.id)}>
    {/* Avatar with Initials */}
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>
        {getInitials(
          item.user
            ? `${item.user.firstName} ${item.user.lastName}`
            : item.name,
        )}
      </Text>
    </View>

    {/* Member Details */}
    <View style={styles.memberDetails}>
      <Text style={styles.memberName} numberOfLines={1} ellipsizeMode="tail">
        {item.user ? `${item.user.firstName} ${item.user.lastName}` : item.name}
      </Text>
      <Text style={styles.memberApartment} numberOfLines={1}>
        House: {item.houseNumber}
        {item.unit ? `, Unit ${item.unit}` : ''}
      </Text>
      <Text style={styles.memberContact} numberOfLines={1}>
        {item.user?.phone || item.phone}
      </Text>
      <Text style={styles.memberContact} numberOfLines={1}>
        {item.user?.email || item.email}
      </Text>
      {item.householdSize && (
        <Text style={styles.memberFamily} numberOfLines={1}>
          Household: {item.householdSize}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

const ResidentsSearchTab: React.FC<ResidentsSearchTabProps> = ({
  searchQuery,
}) => {
  const [residents, setResidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const handleResidentPress = (residentId: string) => {
    (navigation as any).navigate('ViewResident', {residentId});
  };

  const loadResidents = useCallback(async (query?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const andConditions: any = [];
      if (query && query.trim()) {
        const searchTerm = query.trim();
        andConditions.push({
          $or: [
            {houseNumber: {$containsi: searchTerm}},
            {blockCourt: {$containsi: searchTerm}},
            {unit: {$containsi: searchTerm}},
            {user: {firstName: {$containsi: searchTerm}}},
            {user: {lastName: {$containsi: searchTerm}}},
            {user: {phone: {$containsi: searchTerm}}},
            {user: {email: {$containsi: searchTerm}}},
          ],
        });
      }
      const response = await securityGuardGuestService.getAllResidents({
        pagination: {
          page: 1,
          pageSize: 50,
        },
        sort: ['updatedAt:desc'],
        filters: andConditions.length > 0 ? {$and: andConditions} : {},
        populate: ['user'],
      });
      setResidents(normalize(response.data));
    } catch (err: any) {
      console.error('Error loading residents:', err);
      setError('Failed to load residents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFocused) return;
    const timeoutId = setTimeout(() => {
      loadResidents(searchQuery);
    }, 300); // Debounce search for 300ms
    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadResidents, isFocused]);

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Loading residents...</Text>
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
            onPress={() => loadResidents(searchQuery)}>
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
            No residents found for '{searchQuery}'
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Icon name="users" size={48} color={colors.grayFont} />
        <Text style={styles.emptyText}>No residents found</Text>
      </View>
    );
  };

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={residents}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ResidentItem item={item} onPress={handleResidentPress} />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          residents.length === 0 ? styles.listContainer : styles.listContainer
        }
        columnWrapperStyle={styles.row}
        ListEmptyComponent={renderEmptyState}
        refreshing={isLoading}
        onRefresh={() => loadResidents(searchQuery)}
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
  row: {
    justifyContent: 'space-between',
  },
  memberItem: {
    backgroundColor: colors.whiteBg,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 12,
    width: '48%',
  },
  avatar: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#E5E5E5',
  },
  avatarText: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
  },
  memberDetails: {
    alignItems: 'flex-start',
  },
  memberName: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    textAlign: 'left',
    marginBottom: 4,
  },
  memberApartment: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.primary,
    marginBottom: 4,
    textAlign: 'left',
  },
  memberContact: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 2,
    textAlign: 'left',
  },
  memberFamily: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 2,
    textAlign: 'left',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginTop: 16,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: colors.whiteBg,
    fontSize: 16,
    fontFamily: fonts.semibold,
  },
});

export default ResidentsSearchTab;
