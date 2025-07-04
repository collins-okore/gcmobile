import React, {useState} from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from '../../../components/Common/Icon';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';

// Sample data for demonstration
const sampleVehicles = [
  {
    id: '1',
    licensePlate: 'ABC-123',
    make: 'Toyota',
    model: 'Camry',
    color: 'Blue',
    ownerName: 'John Doe',
    apartmentNo: 'A-101',
  },
  {
    id: '2',
    licensePlate: 'XYZ-789',
    make: 'Honda',
    model: 'Civic',
    color: 'Red',
    ownerName: 'Alice Johnson',
    apartmentNo: 'C-301',
  },
];

// Vehicle Item Component
const VehicleItem = ({item}: {item: any}) => (
  <TouchableOpacity style={styles.itemCard}>
    <View style={styles.avatar}>
      <Icon name="car" size={24} color={colors.grayFont} />
    </View>
    <View style={styles.itemContent}>
      <Text style={styles.itemName}>{item.licensePlate}</Text>
      <Text style={styles.itemDetail}>
        {item.make} {item.model}
      </Text>
      <Text style={styles.itemDetail}>Color: {item.color}</Text>
      <Text style={styles.itemDetail}>Owner: {item.ownerName}</Text>
      <Text style={styles.itemDetail}>Apt: {item.apartmentNo}</Text>
    </View>
    <Icon name="chevron-right" size={20} color={colors.grayFont} />
  </TouchableOpacity>
);

const VehiclesSearchTab = () => {
  const [filteredVehicles, _setFilteredVehicles] = useState(sampleVehicles);

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={filteredVehicles}
        keyExtractor={item => item.id}
        renderItem={({item}) => <VehicleItem item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="search" size={48} color={colors.grayFont} />
            <Text style={styles.emptyText}>No vehicles found</Text>
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
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.whiteBg,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 2,
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

export default VehiclesSearchTab;
