import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {Toast} from 'toastify-react-native';
import Modal from 'react-native-modal';
import residentGuestService, {
  ResidentGuest,
} from '../../services/residentGuestService';

import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import {format, isThisYear} from 'date-fns';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from '../../components/Common/Icon';
import GuestTimeline from '../../components/Common/GuestTimeline';
import {normalize} from '../../lib/normalize';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const time = format(date, 'HH:mm');

  // If it's this year, don't show the year
  if (isThisYear(date)) {
    return `${format(date, 'do MMM')} · ${time}`; // e.g., "1st Jun · 12:28"
  }

  return `${format(date, 'dd MMM yyyy')} · ${time}`; // e.g., "13 May 2022 · 13:30"
};

const ViewGuest = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {guestId} = route.params as {guestId: string};

  const [guest, setGuest] = useState<ResidentGuest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Fetch guest data function
  const fetchGuest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await residentGuestService.getResidentGuestById(
        guestId,
        {
          populate: ['resident.user'],
        },
      );

      setGuest(normalize(response.data));
    } catch (err: any) {
      console.error('Error fetching guest:', err);
      setError('Failed to load guest details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [guestId]);

  // Fetch guest data on component mount and auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (guestId) {
        fetchGuest();
      }
    }, [guestId, fetchGuest]),
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 0);
  };

  const handleEditPress = () => {
    setIsModalVisible(false);
    (navigation as any).navigate('EditResidentGuest', {guestId});
  };

  const handleCancelGuest = () => {
    setIsModalVisible(false);
    Alert.alert(
      'Cancel Guest',
      `Are you sure you want to cancel ${guest?.name}'s visit? This action cannot be undone.`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: confirmCancelGuest,
        },
      ],
    );
  };

  const confirmCancelGuest = async () => {
    try {
      setLoading(true);
      await residentGuestService.markGuestAsCancelled(guestId);

      // Update local state
      setGuest(prev => (prev ? {...prev, status: 'cancelled'} : null));

      Toast.show({
        type: 'success',
        text1: 'Guest Cancelled',
        text2: `${guest?.name}'s visit has been cancelled`,
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.error('Error cancelling guest:', error);

      let errorMessage = 'Failed to cancel guest. Please try again.';

      if (error.response?.status === 404) {
        errorMessage = 'Guest not found. It may have been deleted.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Toast.show({
        type: 'error',
        text1: 'Failed to Cancel',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status display info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {text: 'Pending', color: '#FF9800', bgColor: '#FFF3E0'};
      case 'arrived':
        return {text: 'Checked In', color: colors.primary, bgColor: '#E3F2FD'};
      case 'departed':
        return {text: 'Departed', color: '#4CAF50', bgColor: '#E8F5E8'};
      case 'cancelled':
        return {text: 'Cancelled', color: '#F44336', bgColor: '#FFEBEE'};
      default:
        return {text: 'Unknown', color: colors.grayFont, bgColor: '#F5F5F5'};
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading guest details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !guest) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Guest not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleBackPress}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = getStatusInfo(guest.status);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <SafeAreaView
        style={[styles.header, isScrolled && styles.headerWithShadow]}
        edges={['left', 'right', 'top']}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-left" size={24} color={colors.darkFont} />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Guest Details</Text>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsModalVisible(true)}
          testID="guest-options-menu">
          <Icon size={24} color={colors.darkFont} name="ellipsis-h-alt" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <SafeAreaView
          style={styles.scrollContent}
          edges={['left', 'right', 'bottom']}>
          <View style={styles.heroSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Icon name="user" size={32} color={colors.grayIconColor} />
              </View>
            </View>
            <Text style={styles.guestName}>{guest.name}</Text>
            <Text style={styles.guestPhone}>
              {`${guest.phoneCallingCode} ${guest.phone}`}
            </Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: statusInfo.bgColor},
                ]}>
                <Text style={[styles.statusText, {color: statusInfo.color}]}>
                  {statusInfo.text}
                </Text>
              </View>
              <Text style={styles.arrivalTime}>
                {formatDate(guest.arrivalTime)}
              </Text>
            </View>
          </View>
          <View style={styles.guestDetails}>
            <View style={styles.guestDetailsHeader}>
              <Text style={styles.guestDetailsSectionTitle}>Guest Details</Text>
            </View>
            <View style={styles.guestDetailsItem}>
              <View style={styles.guestDetailsIconContainer}>
                <Icon name="user" size={20} color={colors.grayIconColor} />
              </View>
              <View>
                <Text style={styles.guestDetailsTitle}>Full Name</Text>
                <Text style={styles.guestDetailsValue}>{guest.name}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <View style={styles.guestDetailsIconContainer}>
                <Icon name="id-card" size={20} color={colors.grayIconColor} />
              </View>

              <View>
                <Text style={styles.guestDetailsTitle}>ID Number</Text>
                <Text style={styles.guestDetailsValue}>
                  {guest.idNumber || 'Not Provided'}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <View style={styles.guestDetailsIconContainer}>
                <Icon name="phone" size={20} color={colors.grayIconColor} />
              </View>
              <View>
                <Text style={styles.guestDetailsTitle}>Phone</Text>
                <Text
                  style={
                    styles.guestDetailsValue
                  }>{`${guest.phoneCallingCode} ${guest.phone}`}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <View style={styles.guestDetailsIconContainer}>
                <Icon name="briefcase" size={20} color={colors.grayIconColor} />
              </View>
              <View>
                <Text style={styles.guestDetailsTitle}>Purpose</Text>
                <Text style={styles.guestDetailsValue}>{guest.purpose}</Text>
              </View>
            </View>
            <View style={styles.divider} />

            {guest.resident?.houseNumber && (
              <>
                <View style={styles.divider} />
                <View style={styles.guestDetailsItem}>
                  <View style={styles.guestDetailsIconContainer}>
                    <Icon name="home" size={20} color={colors.grayIconColor} />
                  </View>
                  <View>
                    <Text style={styles.guestDetailsTitle}>House Number</Text>
                    <Text style={styles.guestDetailsValue}>
                      House {guest.resident.houseNumber}
                    </Text>
                  </View>
                </View>
              </>
            )}
            {guest.resident?.blockCourt && (
              <>
                <View style={styles.divider} />
                <View style={styles.guestDetailsItem}>
                  <View style={styles.guestDetailsIconContainer}>
                    <Icon
                      name="warehouse"
                      size={20}
                      color={colors.grayIconColor}
                    />
                  </View>
                  <View>
                    <Text style={styles.guestDetailsTitle}>Block/Court</Text>

                    <Text style={styles.guestDetailsValue}>
                      {guest.resident.blockCourt}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
          {(guest.vehicleLicensePlate ||
            guest.vehicleMake ||
            guest.vehicleModel ||
            guest.vehicleColor) && (
            <View style={styles.guestDetails}>
              <View style={styles.guestDetailsHeader}>
                <Text style={styles.guestDetailsSectionTitle}>
                  Vehicle Details
                </Text>
              </View>
              {guest.vehicleLicensePlate && (
                <>
                  <View style={styles.guestDetailsItem}>
                    <View style={styles.guestDetailsIconContainer}>
                      <Icon
                        name="address-card"
                        size={20}
                        color={colors.grayIconColor}
                      />
                    </View>
                    <View>
                      <Text style={styles.guestDetailsTitle}>
                        License Plate
                      </Text>
                      <Text style={styles.guestDetailsValue}>
                        {guest.vehicleLicensePlate &&
                        guest.vehicleLicensePlate.trim()
                          ? guest.vehicleLicensePlate.toUpperCase()
                          : 'No Vehicle'}
                      </Text>
                    </View>
                  </View>
                  {(guest.vehicleMake ||
                    guest.vehicleModel ||
                    guest.vehicleColor) && <View style={styles.divider} />}
                </>
              )}
              {guest.vehicleMake && (
                <>
                  <View style={styles.guestDetailsItem}>
                    <View style={styles.guestDetailsIconContainer}>
                      <Icon
                        name="car-side"
                        size={20}
                        color={colors.grayIconColor}
                      />
                    </View>
                    <View>
                      <Text style={styles.guestDetailsTitle}>
                        Vehicle Make & Model
                      </Text>
                      <Text style={styles.guestDetailsValue}>
                        {guest.vehicleMake} {guest.vehicleModel}
                      </Text>
                    </View>
                  </View>
                  {(guest.vehicleModel || guest.vehicleColor) && (
                    <View style={styles.divider} />
                  )}
                </>
              )}

              {guest.vehicleColor && (
                <View style={styles.guestDetailsItem}>
                  <View style={styles.guestDetailsIconContainer}>
                    <Icon
                      name="palette"
                      size={20}
                      color={colors.grayIconColor}
                    />
                  </View>
                  <View>
                    <Text style={styles.guestDetailsTitle}>Vehicle Color</Text>
                    <Text style={styles.guestDetailsValue}>
                      {guest.vehicleColor}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
          <GuestTimeline guest={guest} />
        </SafeAreaView>
      </ScrollView>
      <SafeAreaView
        style={styles.bottomBar}
        edges={['left', 'right', 'bottom']}>
        <View>
          {guest.status === 'pending' && (
            <>
              <Text style={styles.bottomBarTitle}>Booked on</Text>
              <Text style={styles.bottomBarValue}>
                {formatDate(guest.createdAt)}
              </Text>
            </>
          )}
          {guest.status === 'arrived' && (
            <>
              <Text style={styles.bottomBarTitle}>Checked in</Text>
              <Text style={styles.bottomBarValue}>
                {formatDate(guest.arrivalTime)}
              </Text>
            </>
          )}
          {guest.status === 'departed' && (
            <>
              <Text style={styles.bottomBarTitle}>Checked out</Text>
              <Text style={styles.bottomBarValue}>
                {formatDate(guest.departureTime || '')}
              </Text>
            </>
          )}
          {guest.status === 'cancelled' && (
            <>
              <Text style={styles.bottomBarTitle}>Cancelled</Text>
              <Text style={styles.bottomBarValue}>
                {formatDate(guest.cancelledAt || '')}
              </Text>
            </>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.bottomBarButton,
            (guest.status === 'cancelled' || guest.status === 'departed') &&
              styles.bottomBarButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleEditPress}
          disabled={
            guest.status === 'cancelled' || guest.status === 'departed'
          }>
          <Text
            style={[
              styles.bottomBarButtonText,
              (guest.status === 'cancelled' || guest.status === 'departed') &&
                styles.bottomBarButtonTextDisabled,
            ]}>
            Edit Guest
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom Modal for Menu Options */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        onSwipeComplete={() => setIsModalVisible(false)}
        swipeDirection={['down']}
        style={styles.modal}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={300}
        statusBarTranslucent={true}>
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Guest Options</Text>
          </View>
          <View style={styles.modalOptions}>
            <TouchableOpacity
              style={[
                styles.modalOption,
                (guest.status === 'cancelled' || guest.status === 'departed') &&
                  styles.modalOptionDisabled,
              ]}
              onPress={handleEditPress}
              disabled={
                guest.status === 'cancelled' || guest.status === 'departed'
              }>
              <View style={styles.modalOptionIcon}>
                <Icon
                  name="pen-nib"
                  size={17}
                  color={
                    guest.status === 'cancelled' || guest.status === 'departed'
                      ? '#BDBDBD'
                      : colors.grayIconColor
                  }
                />
              </View>
              <Text
                style={[
                  styles.modalOptionText,
                  (guest.status === 'cancelled' ||
                    guest.status === 'departed') &&
                    styles.modalOptionTextDisabled,
                ]}>
                Edit Guest
              </Text>
            </TouchableOpacity>

            {/* Only show cancel option if guest is not already cancelled or departed */}
            {guest.status !== 'cancelled' && guest.status !== 'departed' && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleCancelGuest}>
                <View style={styles.modalOptionIcon}>
                  <Icon name="ban" size={17} color="#F44336" />
                </View>
                <Text style={[styles.modalOptionText, {color: '#F44336'}]}>
                  Cancel Guest
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.whiteBg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerWithShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
    marginTop: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  guestName: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginBottom: 4,
    textAlign: 'center',
  },
  guestPhone: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.grayFont,
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
  },
  arrivalTime: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },

  guestInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  guestId: {
    fontSize: 14,
    color: colors.grayFont,
    fontFamily: fonts.regular,
  },

  guestInfoContent: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  status: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-start',
  },

  timeText: {
    fontSize: 15,
    color: colors.darkFont,
    fontFamily: fonts.regular,
  },
  guestDetails: {
    paddingVertical: 8,
    backgroundColor: colors.whiteBg,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  guestDetailsHeader: {
    paddingTop: 20,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  iconContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 5,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  guestDetailsSectionTitle: {
    fontSize: 18,
    color: colors.darkFont,
    fontFamily: fonts.bold,
  },
  guestDetailsTitle: {
    fontSize: 16,
    color: colors.darkFont,
    fontFamily: fonts.semibold,
  },
  guestDetailsValue: {
    fontSize: 16,
    color: colors.grayFont,
    fontFamily: fonts.regular,
  },
  guestDetailsItem: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  divider: {
    // borderBottomWidth: 0.5,
    // borderBottomColor: '#EFEFEF',
    marginHorizontal: 16,
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
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.whiteBg,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  bottomBarButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  bottomBarButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.whiteBg,
  },
  bottomBarButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  bottomBarButtonTextDisabled: {
    color: '#BDBDBD',
  },
  bottomBarTitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  bottomBarValue: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
  },
  guestDetailsIconContainer: {
    justifyContent: 'center',
    width: 26,
  },

  // Modal Styles
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: colors.whiteBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '50%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    textAlign: 'center',
  },
  modalOptions: {
    paddingTop: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  modalOptionDisabled: {
    opacity: 0.5,
  },
  modalOptionTextDisabled: {
    color: '#BDBDBD',
  },
});

export default ViewGuest;
