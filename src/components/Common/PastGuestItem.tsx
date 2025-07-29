import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useMemo} from 'react';
import fonts from '../../themes/fonts';
import colors from '../../themes/colors';
import {format, isThisYear} from 'date-fns';
import Icon from './Icon';

interface Guest {
  id: string;
  name: string;
  date: string;
  purpose: string;
  vehiclePlate: string;
  status: string;
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
  const [iconColor, iconBgColor, iconName] = useMemo(() => {
    if (guest.status === 'pending') {
      return [colors.grayIconColor, colors.grayBg, 'clock'];
    }
    if (guest.status === 'arrived') {
      return [colors.grayIconColor, colors.grayBg, 'check-circle'];
    }
    if (guest.status === 'cancelled') {
      return [colors.grayIconColor, colors.grayBg, 'ban'];
    }
    if (guest.status === 'departed') {
      return [colors.grayIconColor, colors.grayBg, 'walking'];
    }
    return ['#9E9E9E', '#F5F5F5', 'clock'];
  }, [guest]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPressItem(guest.id)}>
      <View style={styles.left}>
        <View style={[styles.avatar, {backgroundColor: iconBgColor}]}>
          <Icon name={iconName} size={22} color={iconColor} />
        </View>
        <View style={styles.details}>
          <Text style={styles.date}>{formatDate(guest.date)}</Text>
          <Text style={styles.name}>{guest.name}</Text>
          <Text style={styles.purpose}>{guest.purpose}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <View style={styles.plateContainer}>
          <Text style={styles.vehiclePlate}>
            {guest.vehiclePlate && guest.vehiclePlate.trim()
              ? guest.vehiclePlate.toUpperCase()
              : 'No Vehicle'}
          </Text>
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
    height: 45,
    width: 45,
    borderRadius: 20,
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
    textTransform: 'capitalize',
  },
  purpose: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textTransform: 'capitalize',
  },
  vehiclePlate: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textTransform: 'uppercase',
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
