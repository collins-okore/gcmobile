import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  PlusIcon,
  TruckIcon,
} from 'react-native-heroicons/outline';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Toast} from 'toastify-react-native';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import residentVehicleService, {
  Vehicle,
} from '../../services/residentVehicleService';

const Vehicles = () => {
  const navigation = useNavigation();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch vehicles from API
  const fetchVehicles = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      const response = await residentVehicleService.getAllVehicles({
        populate: ['resident.user', 'estate'],
        pagination: {
          page: 1,
          pageSize: 100, // Get all vehicles
        },
        sort: {
          updated_at: 'desc',
        },
      });

      setVehicles(response.data || []);
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to load vehicles';
      setError(errorMessage);

      Toast.show({
        type: 'error',
        text1: 'Failed to Load Vehicles',
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
      fetchVehicles();
    }, [fetchVehicles]),
  );

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVehicles(false);
  }, [fetchVehicles]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddVehicle = () => {
    navigation.navigate('AddResidentVehicle' as never);
  };

  const handleVehiclePress = (vehicle: Vehicle) => {
    (navigation as any).navigate('ViewResidentVehicle', {
      vehicleId: vehicle.id,
    });
  };

  const renderVehicleItem = ({item}: {item: Vehicle}) => (
    <TouchableOpacity
      style={styles.vehicleItem}
      activeOpacity={0.7}
      onPress={() => handleVehiclePress(item)}>
      {/* Vehicle Avatar - Square Gray Background */}
      <View style={styles.vehicleAvatar}>
        <TruckIcon size={36} color={colors.grayIconColor} />
      </View>

      {/* Vehicle Details */}
      <View style={styles.vehicleDetails}>
        <Text style={styles.plateNumber} numberOfLines={1}>
          {item.license_plate}
        </Text>
        <Text style={styles.vehicleMake} numberOfLines={1}>
          {item.make}
        </Text>
        <Text style={styles.vehicleModel} numberOfLines={1}>
          {item.model}
        </Text>
        <Text style={styles.vehicleColor} numberOfLines={1}>
          {item.color}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <TruckIcon size={64} color={colors.grayIconColor} />
      <Text style={styles.emptyStateTitle}>No Vehicles Added</Text>
      <Text style={styles.emptyStateText}>
        Tap the + icon to add your first vehicle
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Failed to Load Vehicles</Text>
      <Text style={styles.emptyStateText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => fetchVehicles()}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading vehicles...</Text>
        </View>
      );
    }

    if (error && vehicles.length === 0) {
      return renderErrorState();
    }

    if (vehicles.length === 0) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={vehicles}
        renderItem={renderVehicleItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
          <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle}>
            <PlusIcon size={24} color={colors.darkFont} />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>My Vehicles</Text>
          <Text style={styles.subtitle}>
            Manage and view all registered vehicles
          </Text>
        </View>

        {/* Vehicles List */}
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
    marginBottom: 4,
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
  vehicleItem: {
    backgroundColor: colors.whiteBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleAvatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vehicleDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  plateNumber: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginBottom: 4,
  },
  vehicleMake: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.primary,
    marginBottom: 2,
  },
  vehicleModel: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.darkFont,
    marginBottom: 2,
  },
  vehicleColor: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
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

export default Vehicles;
