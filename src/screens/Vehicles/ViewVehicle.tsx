import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Text,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Toast} from 'toastify-react-native';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import Button from '../../components/Common/Button/index';
import DropdownMenu from '../../components/Common/DropdownMenu/index';
import residentVehicleService, {
  Vehicle,
} from '../../services/residentVehicleService';
import Icon from '../../components/Common/Icon';
import {normalize} from '../../lib/normalize';

const ViewVehicle = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {vehicleId} = route.params as {vehicleId: string};

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVehicleData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await residentVehicleService.getVehicleById(vehicleId, {
        populate: ['resident.user', 'estate'],
      });

      setVehicle(normalize(response.data));
    } catch (error: any) {
      console.error('Error fetching vehicle:', error);
      const errorMessage = 'Failed to load vehicle details. Please try again.';
      setError(errorMessage);

      Toast.show({
        type: 'error',
        text1: 'Failed to Load Vehicle',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    loadVehicleData();
  }, [loadVehicleData]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleEditPress = () => {
    (navigation as any).navigate('EditResidentVehicle', {vehicleId});
  };

  const handleDeleteVehicle = async () => {
    try {
      await residentVehicleService.deleteVehicle(vehicleId);

      Toast.show({
        type: 'success',
        text1: 'Vehicle Deleted',
        text2: 'Vehicle has been successfully removed',
        position: 'top',
        visibilityTime: 3000,
      });

      // Navigate back after a short delay
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);

      let errorMessage = 'Failed to delete vehicle. Please try again.';

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Vehicle not found. It may have already been deleted.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage =
          'Network error. Please check your connection and try again.';
      }

      Toast.show({
        type: 'error',
        text1: 'Failed to Delete Vehicle',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    }
  };

  const dropdownOptions = [
    {
      label: 'Edit Vehicle',
      value: 'edit',
      onPress: handleEditPress,
      icon: 'pencil',
    },
    {
      label: 'Delete Vehicle',
      value: 'delete',
      onPress: handleDeleteVehicle,
      icon: 'trash',
      textColor: '#EF4444',
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <Text style={styles.title}>Vehicle Details</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading vehicle details...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <Text style={styles.title}>Vehicle Details</Text>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <View style={styles.retryButtonContainer}>
              <Button title="Retry" onPress={loadVehicleData} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Show vehicle not found
  if (!vehicle) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <Text style={styles.title}>Vehicle Details</Text>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Vehicle not found</Text>
            <View style={styles.retryButtonContainer}>
              <Button title="Go Back" onPress={handleBackPress} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeftIcon size={24} color={colors.darkFont} />
          </TouchableOpacity>
          <DropdownMenu
            trigger={
              <View style={styles.menuButton}>
                <Icon size={21} color={colors.darkFont} name="ellipsis-h-alt" />
              </View>
            }
            options={dropdownOptions}
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Vehicle Details</Text>
          <Text style={styles.subtitle}>
            {vehicle?.make} {vehicle?.model} • {vehicle?.licensePlate}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Vehicle Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Information</Text>
              <View style={styles.card}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>License Plate</Text>
                  <Text style={styles.value}>{vehicle.licensePlate}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Make</Text>
                  <Text style={styles.value}>{vehicle.make}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Model</Text>
                  <Text style={styles.value}>{vehicle.model}</Text>
                </View>
                {vehicle.color && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Color</Text>
                      <Text style={styles.value}>{vehicle.color}</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Owner Information */}
            {vehicle.resident && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Owner Information</Text>
                <View style={styles.card}>
                  {vehicle.resident.user && (
                    <>
                      <View style={styles.infoRow}>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.value}>
                          {vehicle.resident.user.firstName}{' '}
                          {vehicle.resident.user.lastName}
                        </Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.infoRow}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>
                          {vehicle.resident.user.email}
                        </Text>
                      </View>
                      {vehicle.resident.user.phone && (
                        <>
                          <View style={styles.divider} />
                          <View style={styles.infoRow}>
                            <Text style={styles.label}>Phone</Text>
                            <Text style={styles.value}>
                              {vehicle.resident.user.phone}
                            </Text>
                          </View>
                        </>
                      )}
                      <View style={styles.divider} />
                    </>
                  )}
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>House Number</Text>
                    <Text style={styles.value}>
                      {vehicle.resident.houseNumber}
                      {vehicle.resident.unit && ` - ${vehicle.resident.unit}`}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Estate Information */}
            {vehicle?.resident?.estate && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Estate Information</Text>
                <View style={styles.card}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Estate Name</Text>
                    <Text style={styles.value}>
                      {vehicle.resident.estate.name}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Registration Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Registration Details</Text>
              <View style={styles.card}>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Registered On</Text>
                  <Text style={styles.value}>
                    {formatDate(vehicle.createdAt)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Last Updated</Text>
                  <Text style={styles.value}>
                    {formatDate(vehicle.updatedAt)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom spacing */}
            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  scrollContent: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 0,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  menuButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginTop: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginBottom: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.grayBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.primary,
    marginLeft: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.whiteBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.grayFont,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.darkFont,
    flex: 2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButtonContainer: {
    width: '100%',
    maxWidth: 200,
  },
  bottomSpacing: {
    height: 32,
  },
});

export default ViewVehicle;
