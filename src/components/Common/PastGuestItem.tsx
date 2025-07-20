import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import fonts from '../../themes/fonts';
import colors from '../../themes/colors';
import {CalendarIcon} from 'react-native-heroicons/outline';
import {format, isThisYear} from 'date-fns';

interface Guest {
  id: string;
  name: string;
  date: string;
  purpose: string;
  vehiclePlate: string;
}

interface PastGuestItemProps {
  guest: Guest;
  onPressItem: (guestId: string) => void;
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

const PastGuestItem: React.FC<PastGuestItemProps> = ({guest, onPressItem}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPressItem(guest.id)}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <CalendarIcon color={colors.grayIconColor} size={26} />
        </View>
        <View style={styles.details}>
          <Text style={styles.date}>{formatDate(guest.date)}</Text>
          <Text style={styles.name}>{guest.name}</Text>
          <Text style={styles.purpose}>{guest.purpose}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <View style={styles.plateContainer}>
          <Text style={styles.vehiclePlate}>{guest.vehiclePlate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flexDirection: 'column',
    marginLeft: 16,
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
});

export default PastGuestItem;
