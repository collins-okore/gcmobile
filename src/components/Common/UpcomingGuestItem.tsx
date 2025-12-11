import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useMemo} from 'react';
import fonts from '../../themes/fonts';
import colors from '../../themes/colors';
import {format, isThisYear, isToday} from 'date-fns';
import {TruckIcon, UserIcon} from 'react-native-heroicons/outline';

interface Guest {
  id: string;
  name: string;
  date: string;
  purpose: string;
  vehiclePlate: string;
  status: string;
  code?: string; // Add code if available in your Guest interface
}

interface UpcomingGuestItemProps {
  guest: Guest;
  onPressItem: (guestId: string) => void;
  index: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const time = format(date, 'h:mm a'); // 2:00 PM format

  if (isToday(date)) {
    return `Scheduled ${time}`;
  }

  // If it's this year, don't show the year
  if (isThisYear(date)) {
    return `${format(date, 'MMM do')} · ${time}`;
  }

  return `${format(date, 'MMM dd yyyy')} · ${time}`;
};

const UpcomingGuestItem: React.FC<UpcomingGuestItemProps> = ({
  guest,
  onPressItem,
  index,
}) => {
  const [statusColor, statusBgColor, statusText] = useMemo(() => {
    if (guest.status === 'pending') {
      return ['#0A7FF2', '#E6F2FE', 'Active']; // Blue for active/pending
    }
    if (guest.status === 'arrived') {
      return ['#22C55E', '#DCFCE7', 'Arrived']; // Green
    }
    if (guest.status === 'cancelled') {
      return ['#EF4444', '#FEE2E2', 'Cancelled']; // Red
    }
    return ['#6B7280', '#F3F4F6', 'Inactive']; // Gray default
  }, [guest.status]);

  const renderIcon = () => {
    // Basic logic to differentiate delivery vs person
    // You might want a more robust way to check this (e.g. guestType field)
    if (guest.purpose.toLowerCase().includes('delivery')) {
      return <TruckIcon size={24} color={'#0A7FF2'} />;
    }
    return <UserIcon size={24} color={'#0A7FF2'} />;
  };

  return (
    <View style={index === 0 ? styles.firstItemContainer : undefined}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => onPressItem(guest.id)}>
        {/* Top Row: Icon, Name/Time, Status Badge */}
        <View style={styles.topRow}>
          <View style={styles.iconContainer}>{renderIcon()}</View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{guest.name}</Text>
            <Text style={styles.date}>{formatDate(guest.date)}</Text>
          </View>

          <View style={[styles.statusBadge, {backgroundColor: statusBgColor}]}>
            <View style={[styles.statusDot, {backgroundColor: statusColor}]} />
            <Text style={[styles.statusText, {color: statusColor}]}>
              {statusText}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bottom Row: User Avatar/Name, Code */}
        <View style={styles.bottomRow}>
          <View style={styles.userContainer}>
            {/* <View style={styles.userAvatar}>
              <UserIcon size={12} color="#9CA3AF" />
            </View> */}
            {/* Placeholder for "Created by" user, usually current user for resident app */}
            <Text style={styles.codeText}>{guest.purpose}</Text>
          </View>

          {/* Mock code for now if not present in guest object */}
          {/* <Text style={styles.codeText}>CODE: 8829</Text> */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  firstItemContainer: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.grayFont,
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.whiteBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF', // Light blue bg
    borderWidth: 1,
    borderColor: 'rgb(219, 234, 254)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    fontFamily: fonts.semibold,
    color: 'rgb(15 23 42)',
    marginBottom: 4,
  },
  date: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: 'rgb(100, 116, 139)',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgb(219, 234, 254)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  codeText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: '#9CA3AF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  codeValue: {
    color: colors.darkFont,
    fontSize: 14,
  },
});

export default UpcomingGuestItem;
