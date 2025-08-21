import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal as RNModal,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {Toast} from 'toastify-react-native';
import securityGuardGuestService, {
  SecurityGuardGuest,
} from '../../../services/securityGuardGuestService';

import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import {format, isThisYear} from 'date-fns';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from '../../../components/Common/Icon';
import {normalize} from '../../../lib/normalize';
import DateTimeInput from '../../../components/Common/DateTimeInput';
import Modal from 'react-native-modal';
import GuestTimeline from '../../../components/Common/GuestTimeline';

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const time = format(date, 'HH:mm');

  if (isThisYear(date)) {
    return `${format(date, 'do MMM')} · ${time}`;
  }

  return `${format(date, 'dd MMM yyyy')} · ${time}`;
};

const ViewGuest = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {guestId} = route.params as {guestId: string};

  const [guest, setGuest] = useState<SecurityGuardGuest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  // Arrival/Departure modals
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [showDepartureModal, setShowDepartureModal] = useState(false);
  const [departureTime, setDepartureTime] = useState(new Date());

  const fetchGuest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await securityGuardGuestService.getGuestById(guestId, {
        populate: ['resident', 'resident.user', 'estate'],
        pagination: {page: 1, pageSize: 1},
      });

      setGuest(normalize(response.data));
    } catch (err: any) {
      console.error('Error fetching guest:', err);
      setError('Failed to load guest details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [guestId]);

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
    setIsOptionsVisible(false);
    (navigation as any).navigate('EditSecurityGuardGuest', {guestId});
  };

  const handleMarkAsArrived = () => {
    setIsOptionsVisible(false);
    setArrivalTime(new Date());
    setShowArrivalModal(true);
  };

  const handleArrivalModalCancel = () => {
    setShowArrivalModal(false);
  };

  const handleArrivalModalSubmit = async () => {
    setShowArrivalModal(false);
    await confirmMarkAsArrived(arrivalTime);
  };

  const confirmMarkAsArrived = async (selectedTime?: Date) => {
    try {
      setLoading(true);
      await securityGuardGuestService.markGuestAsArrived(
        guestId,
        selectedTime ? selectedTime.toISOString() : undefined,
      );
      setGuest(prev =>
        prev
          ? {
              ...prev,
              status: 'arrived',
              arrivalTime: selectedTime
                ? selectedTime.toISOString()
                : prev.arrivalTime,
            }
          : null,
      );
      Toast.show({
        type: 'success',
        text1: 'Guest Checked In',
        text2: `${guest?.name} has been marked as arrived`,
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.error('Error marking guest as arrived:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Check In',
        text2: 'Failed to mark guest as arrived. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDeparted = () => {
    setIsOptionsVisible(false);
    setDepartureTime(new Date());
    setShowDepartureModal(true);
  };

  const handleDepartureModalCancel = () => {
    setShowDepartureModal(false);
  };

  const handleDepartureModalSubmit = async () => {
    setShowDepartureModal(false);
    await confirmMarkAsDeparted(departureTime);
  };

  const confirmMarkAsDeparted = async (selectedTime?: Date) => {
    try {
      setLoading(true);
      const departureTimeStr = selectedTime
        ? selectedTime.toISOString()
        : new Date().toISOString();
      await securityGuardGuestService.markGuestAsDeparted(
        guestId,
        departureTimeStr,
      );
      setGuest(prev =>
        prev
          ? {...prev, status: 'departed', departureTime: departureTimeStr}
          : null,
      );
      Toast.show({
        type: 'success',
        text1: 'Guest Departed',
        text2: `${guest?.name} has been marked as departed`,
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.error('Error marking guest as departed:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Mark Departed',
        text2: 'Failed to mark guest as departed. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelGuest = () => {
    setIsOptionsVisible(false);
    Alert.alert(
      'Cancel Guest',
      `Are you sure you want to cancel ${guest?.name}'s visit? This action cannot be undone.`,
      [
        {text: 'No', style: 'cancel'},
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
      await securityGuardGuestService.markGuestAsCancelled(guestId);
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
      Toast.show({
        type: 'error',
        text1: 'Failed to Cancel',
        text2: 'Failed to cancel guest. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

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

      {/* Header */}
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
          onPress={() => setIsOptionsVisible(true)}
          testID="guest-options-menu">
          <Icon size={24} color={colors.darkFont} name="ellipsis-h-alt" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <SafeAreaView
          style={styles.scrollContent}
          edges={['left', 'right', 'bottom']}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Icon name="user" size={32} color={colors.grayIconColor} />
              </View>
            </View>
            <Text style={styles.guestName}>{guest.name}</Text>
            <Text style={styles.guestPhone}>
              {(guest.phoneCallingCode ? `${guest.phoneCallingCode} ` : '') +
                guest.phone}
            </Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: statusInfo.bgColor},
                ]}>
                <Text style={[styles.statusText, {color: statusInfo.color}]}>
                  {' '}
                  {statusInfo.text}{' '}
                </Text>
              </View>
              <Text style={styles.arrivalTime}>
                {formatDate(guest.arrivalTime)}
              </Text>
            </View>
          </View>

          {/* Guest Details */}
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
                <Text style={styles.guestDetailsValue}>
                  {(guest.phoneCallingCode
                    ? `${guest.phoneCallingCode} `
                    : '') + guest.phone}
                </Text>
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

            {guest.resident?.user && (
              <>
                <View style={styles.divider} />
                <View style={styles.guestDetailsItem}>
                  <View style={styles.guestDetailsIconContainer}>
                    <Icon name="user" size={20} color={colors.grayIconColor} />
                  </View>
                  <View>
                    <Text style={styles.guestDetailsTitle}>
                      Visiting Resident
                    </Text>
                    <Text style={styles.guestDetailsValue}>
                      {guest.resident.user
                        ? `${guest.resident.user.firstName} ${guest.resident.user.lastName}`
                        : 'N/A'}
                    </Text>
                  </View>
                </View>
              </>
            )}

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

            {guest.resident?.unit && (
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
                    <Text style={styles.guestDetailsTitle}>Unit</Text>
                    <Text style={styles.guestDetailsValue}>
                      {guest.resident.unit}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {guest.estate && (
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
                    <Text style={styles.guestDetailsTitle}>Estate</Text>
                    <Text style={styles.guestDetailsValue}>
                      {guest.estate.name}
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

          <GuestTimeline guest={guest as any} />
        </SafeAreaView>
      </ScrollView>

      {/* Bottom Bar */}
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
                {formatDate(guest.updatedAt)}
              </Text>
            </>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.bottomBarButton,
            !(guest.status === 'pending' || guest.status === 'arrived') &&
              styles.bottomBarButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleEditPress}
          disabled={
            !(guest.status === 'pending' || guest.status === 'arrived')
          }>
          <Text
            style={[
              styles.bottomBarButtonText,
              !(guest.status === 'pending' || guest.status === 'arrived') &&
                styles.bottomBarButtonTextDisabled,
            ]}>
            Edit Guest
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Options Bottom Sheet */}
      <Modal
        isVisible={isOptionsVisible}
        onBackdropPress={() => setIsOptionsVisible(false)}
        onSwipeComplete={() => setIsOptionsVisible(false)}
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
                !(guest.status === 'pending' || guest.status === 'arrived') &&
                  styles.modalOptionDisabled,
              ]}
              onPress={handleEditPress}
              disabled={
                !(guest.status === 'pending' || guest.status === 'arrived')
              }>
              <View style={styles.modalOptionIcon}>
                <Icon
                  name="pen-nib"
                  size={17}
                  color={
                    !(guest.status === 'pending' || guest.status === 'arrived')
                      ? '#BDBDBD'
                      : colors.grayIconColor
                  }
                />
              </View>
              <Text
                style={[
                  styles.modalOptionText,
                  !(guest.status === 'pending' || guest.status === 'arrived') &&
                    styles.modalOptionTextDisabled,
                ]}>
                Edit Guest
              </Text>
            </TouchableOpacity>

            {guest.status === 'pending' && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleMarkAsArrived}>
                <View style={styles.modalOptionIcon}>
                  <Icon name="check" size={17} color={colors.grayIconColor} />
                </View>
                <Text style={styles.modalOptionText}>Mark as Arrived</Text>
              </TouchableOpacity>
            )}

            {guest.status === 'arrived' && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleMarkAsDeparted}>
                <View style={styles.modalOptionIcon}>
                  <Icon
                    name="sign-out"
                    size={17}
                    color={colors.grayIconColor}
                  />
                </View>
                <Text style={styles.modalOptionText}>Mark as Departed</Text>
              </TouchableOpacity>
            )}

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

      {/* Arrival Time Modal */}
      <RNModal
        visible={showArrivalModal}
        transparent
        animationType="slide"
        onRequestClose={handleArrivalModalCancel}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              width: '85%',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.semibold,
                marginBottom: 16,
              }}>
              Select Arrival Time
            </Text>
            <DateTimeInput
              label="Arrival Time"
              value={arrivalTime}
              onChange={setArrivalTime}
              mode="datetime"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 16,
              }}>
              <TouchableOpacity
                onPress={handleArrivalModalCancel}
                style={{marginRight: 16}}>
                <Text style={{color: colors.grayFont, fontSize: 16}}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleArrivalModalSubmit}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontFamily: fonts.semibold,
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>

      {/* Departure Time Modal */}
      <RNModal
        visible={showDepartureModal}
        transparent
        animationType="slide"
        onRequestClose={handleDepartureModalCancel}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              width: '85%',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.semibold,
                marginBottom: 16,
              }}>
              Select Departure Time
            </Text>
            <DateTimeInput
              label="Departure Time"
              value={departureTime}
              onChange={setDepartureTime}
              mode="datetime"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 16,
              }}>
              <TouchableOpacity
                onPress={handleDepartureModalCancel}
                style={{marginRight: 16}}>
                <Text style={{color: colors.grayFont, fontSize: 16}}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDepartureModalSubmit}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontFamily: fonts.semibold,
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
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

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

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
  guestDetailsIconContainer: {
    justifyContent: 'center',
    width: 26,
  },
  divider: {
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

  // Modal Styles (Options Bottom Sheet)
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
