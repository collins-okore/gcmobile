import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import {ArrowLeftIcon, PencilIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';

import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import {format, isThisYear} from 'date-fns';
import {SafeAreaView} from 'react-native-safe-area-context';

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

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditPress = () => {
    navigation.navigate('EditSecurityGuardGuest' as never);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}>
              <PencilIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
          </View>
          <View style={styles.guestInfo}>
            <Text style={styles.guestId}>#1243324</Text>
            <Text style={styles.guestName}>John Doe</Text>
            <View style={styles.statusRow}>
              <View style={styles.status}>
                <Text style={styles.statusText}>Checked In</Text>
              </View>
              <Text style={styles.timeText}>
                {formatDate(new Date().toISOString())}
              </Text>
            </View>
          </View>
          <View style={styles.guestDetails}>
            <View style={styles.guestDetailsHeader}>
              <Text style={styles.guestDetailsTitle}>Guest Details</Text>
            </View>
            {/* <View style={styles.borderBottom} */}
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Full Name</Text>
              <Text style={styles.guestDetailsValue}>John Doe</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Email</Text>
              <Text style={styles.guestDetailsValue}>john.doe@example.com</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Phone</Text>
              <Text style={styles.guestDetailsValue}>+1234567890</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Visiting Resident</Text>
              <Text style={styles.guestDetailsValue}>John Doe</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Block Number</Text>
              <Text style={styles.guestDetailsValue}>Block A</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>House Number</Text>
              <Text style={styles.guestDetailsValue}>House 12</Text>
            </View>
          </View>
          <View style={styles.guestDetails}>
            <View style={styles.guestDetailsHeader}>
              <Text style={styles.guestDetailsTitle}>Vehicle Details</Text>
            </View>
            {/* <View style={styles.borderBottom} */}
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Vehicle Plate</Text>
              <Text style={styles.guestDetailsValue}>KCA 345F</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Vehicle Make & Model</Text>
              <Text style={styles.guestDetailsValue}>Toyota Camry</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  guestInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  guestId: {
    fontSize: 14,
    color: colors.grayFont,
    fontFamily: fonts.regular,
  },
  guestName: {
    fontSize: 24,
    color: colors.darkFont,
    fontFamily: fonts.semibold,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  status: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.semibold,
  },
  timeText: {
    fontSize: 14,
    color: colors.darkFont,
    fontFamily: fonts.regular,
  },
  guestDetails: {
    paddingVertical: 8,
    backgroundColor: colors.whiteBg,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  guestDetailsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
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
  guestDetailsTitle: {
    fontSize: 16,
    color: colors.darkFont,
    fontFamily: fonts.semibold,
  },
  guestDetailsValue: {
    fontSize: 16,
    color: colors.darkFont,
    fontFamily: fonts.regular,
  },
  guestDetailsItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    marginHorizontal: 16,
  },
});

export default ViewGuest;
