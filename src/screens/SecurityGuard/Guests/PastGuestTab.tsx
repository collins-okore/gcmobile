import {View, FlatList, StyleSheet} from 'react-native';
import React from 'react';
import PastGuestItem from '../../../components/Common/PastGuestItem';
import colors from '../../../themes/colors';
import {useNavigation} from '@react-navigation/native';

const datePlaceHolder = new Date();
const data = [
  {
    id: '1',
    name: 'Samuel Kinuthia',
    date: datePlaceHolder.toISOString(),
    purpose: 'Visiting Resident ',
    vehicle_plate: 'KDB 123',
  },
  {
    id: '2',
    name: 'John Owino',
    date: datePlaceHolder.toISOString(),
    purpose: 'Goods/Food Delivery',
    vehicle_plate: 'KBA 234',
  },
  {
    id: '3',
    name: 'Jane Doe',
    date: datePlaceHolder.toISOString(),
    purpose: 'Service Request',
    vehicle_plate: 'KCA 456',
  },
  {
    id: '4',
    name: 'Hillary Magothe',
    date: datePlaceHolder.toISOString(),
    purpose: 'Visiting Resident',
    vehicle_plate: 'KCA 456',
  },
];

const ItemSeparator = () => <View style={styles.separator} />;

const PastGuestTab = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <PastGuestItem
            guest={item}
            onPressItem={() => {
              (navigation as any).navigate('ViewSecurityGuardGuest', {
                guestId: item.id,
              });
            }}
          />
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  listContent: {
    paddingHorizontal: 2,
  },
});

export default PastGuestTab;
