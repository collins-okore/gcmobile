import React, {useState} from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from '../../../components/Common/Icon';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';

// Sample data for demonstration
const sampleResidents = [
  {
    id: '1',
    name: 'Alice Johnson',
    phone: '+1234567892',
    email: 'alice@email.com',
    apartmentNo: 'C-301',
    family: '4 members',
  },
  {
    id: '2',
    name: 'Bob Wilson',
    phone: '+1234567893',
    email: 'bob@email.com',
    apartmentNo: 'D-102',
    family: '2 members',
  },
];

// Helper function to get initials
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Resident Item Component
const ResidentItem = ({item}: {item: any}) => (
  <TouchableOpacity style={styles.memberItem} activeOpacity={0.7}>
    {/* Avatar with Initials */}
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
    </View>

    {/* Member Details */}
    <View style={styles.memberDetails}>
      <Text style={styles.memberName} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
      <Text style={styles.memberApartment} numberOfLines={1}>
        Apt: {item.apartmentNo}
      </Text>
      <Text style={styles.memberContact} numberOfLines={1}>
        {item.phone}
      </Text>
      <Text style={styles.memberContact} numberOfLines={1}>
        {item.email}
      </Text>
      <Text style={styles.memberFamily} numberOfLines={1}>
        {item.family}
      </Text>
    </View>
  </TouchableOpacity>
);

const ResidentsSearchTab = () => {
  const [filteredResidents, _setFilteredResidents] = useState(sampleResidents);

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={filteredResidents}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ResidentItem item={item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="search" size={48} color={colors.grayFont} />
            <Text style={styles.emptyText}>No residents found</Text>
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
    marginBottom: 12,
    width: '48%',
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
  memberApartment: {
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
  memberFamily: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 2,
    textAlign: 'left',
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
});

export default ResidentsSearchTab;
