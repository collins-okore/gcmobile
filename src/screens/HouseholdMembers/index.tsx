import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  PlusIcon,
  UserGroupIcon,
} from 'react-native-heroicons/outline';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Toast} from 'toastify-react-native';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import residentHouseholdMemberService, {
  HouseholdMember,
} from '../../services/residentHouseholdMemberService';
import {normalize} from '../../lib/normalize';

const HouseholdMembers = () => {
  const navigation = useNavigation();

  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch household members from API
  const fetchHouseholdMembers = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      const response =
        await residentHouseholdMemberService.getAllHouseholdMembers({
          pagination: {
            page: 1,
            pageSize: 10, // Get all household members
          },
          sort: ['updatedAt:desc'],
        });

      setHouseholdMembers(normalize(response.data) || []);
    } catch (error: any) {
      console.error('Error fetching household members:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to load household members';
      setError(errorMessage);

      Toast.show({
        type: 'error',
        text1: 'Failed to Load Members',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Auto-refresh when screen becomes visible
  useFocusEffect(
    useCallback(() => {
      fetchHouseholdMembers();
    }, [fetchHouseholdMembers]),
  );

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHouseholdMembers(false);
  }, [fetchHouseholdMembers]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddMember = () => {
    navigation.navigate('AddResidentHouseholdMember' as never);
  };

  const handleEditMember = (member: HouseholdMember) => {
    (navigation as any).navigate('EditResidentHouseholdMember', {
      memberId: member.id,
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const renderHouseholdMember = ({item}: {item: HouseholdMember}) => (
    <TouchableOpacity
      style={styles.memberItem}
      activeOpacity={0.7}
      onPress={() => handleEditMember(item)}>
      {/* Square Avatar - Full Width */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
      </View>

      {/* Member Details - Below Avatar */}
      <View style={styles.memberDetails}>
        <Text style={styles.memberName} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.memberRelationship} numberOfLines={1}>
          {item.relationship}
        </Text>
        <Text style={styles.memberContact} numberOfLines={1}>
          {item.phone}
        </Text>
        {item.email && (
          <Text style={styles.memberContact} numberOfLines={1}>
            {item.email}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <UserGroupIcon size={64} color={colors.grayIconColor} />
      <Text style={styles.emptyStateTitle}>No Household Members</Text>
      <Text style={styles.emptyStateText}>
        Tap the + icon to add your first household member
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Failed to Load Members</Text>
      <Text style={styles.emptyStateText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => fetchHouseholdMembers()}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading household members...</Text>
        </View>
      );
    }

    if (error && householdMembers.length === 0) {
      return renderErrorState();
    }

    if (householdMembers.length === 0) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={householdMembers}
        renderItem={renderHouseholdMember}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeftIcon size={24} color={colors.darkFont} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
            <PlusIcon size={24} color={colors.darkFont} />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Household Members</Text>
          <Text style={styles.subtitle}>
            Manage your family members and household residents
          </Text>
        </View>

        {/* Members List */}
        <View style={styles.listContainer}>{renderContent()}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    lineHeight: 22,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
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
    width: '48%',
    marginBottom: 12,
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
  memberRelationship: {
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
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.whiteBg,
  },
});

export default HouseholdMembers;
