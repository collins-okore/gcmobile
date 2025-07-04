import React, {useState} from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from '../../../components/Common/Icon';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import {CalendarIcon} from 'react-native-heroicons/solid';
import {format, isThisYear} from 'date-fns';
import {useNavigation} from '@react-navigation/native';

// Sample data for demonstration
const sampleGuests = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1234567890',
    date: '2025-06-30T14:30:00',
    status: 'Upcoming',
    apartmentNo: 'A-101',
    vehicle_plate: 'ABC123',
    purpose: 'Delivery',
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+1234567891',
    date: '2025-06-29T10:00:00',
    status: 'Past',
    apartmentNo: 'B-205',
    vehicle_plate: 'XYZ789',
    purpose: 'Meeting',
  },
];
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const time = format(date, 'HH:mm');

  // If it's this year, don't show the year
  if (isThisYear(date)) {
    return `${format(date, 'do MMM')} · ${time}`; // e.g., "1st Jun · 12:28"
  }

  return `${format(date, 'dd MMM yyyy')} · ${time}`; // e.g., "13 May 2022 · 13:30"
};

// Guest Item Component
const GuestItem = ({
  item,
  onPressItem,
}: {
  item: any;
  onPressItem: (guestId: string) => void;
}) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => onPressItem(item.id)}>
    <View style={styles.left}>
      <View style={styles.avatar}>
        <CalendarIcon color={colors.grayIconColor} size={26} />
      </View>
      <View style={styles.details}>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.purpose}>{item.purpose}</Text>
      </View>
    </View>
    <View style={styles.right}>
      <View style={styles.plateContainer}>
        <Text style={styles.vehiclePlate}>{item.vehicle_plate}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const ItemSeparator = () => <View style={styles.separator} />;

const GuestsSearchTab = () => {
  const [filteredGuests, _setFilteredGuests] = useState(sampleGuests);
  const navigation = useNavigation();
  return (
    <View style={styles.tabContent}>
      <FlatList
        data={filteredGuests}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <GuestItem
            item={item}
            onPressItem={() => {
              (navigation as any).navigate('ViewSecurityGuardGuest', {
                guestId: item.id,
              });
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="search" size={48} color={colors.grayFont} />
            <Text style={styles.emptyText}>No guests found</Text>
          </View>
        }
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
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
});

export default GuestsSearchTab;
