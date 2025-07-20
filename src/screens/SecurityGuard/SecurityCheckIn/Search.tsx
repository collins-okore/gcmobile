import {
  StyleSheet,
  View,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {TabView, TabBar} from 'react-native-tab-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from '../../../components/Common/Icon';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import GuestsSearchTab from './GuestsSearchTab';
import ResidentsSearchTab from './ResidentsSearchTab';
import VehiclesSearchTab from './VehiclesSearchTab';

const routes = [
  {key: 'guests', title: 'Guests'},
  {key: 'residents', title: 'Residents'},
  {key: 'vehicles', title: 'Vehicles'},
];

const Search = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const renderScene = ({route}: {route: any}) => {
    switch (route.key) {
      case 'guests':
        return <GuestsSearchTab searchQuery={searchQuery} />;
      case 'residents':
        return <ResidentsSearchTab searchQuery={searchQuery} />;
      case 'vehicles':
        return <VehiclesSearchTab searchQuery={searchQuery} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.darkFont}}
      style={{
        backgroundColor: colors.whiteBg,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      }}
      labelStyle={{
        textTransform: 'none',
        fontFamily: fonts.semibold,
        fontSize: 16,
      }}
      activeColor={colors.darkFont}
      inactiveColor={colors.grayFont}
      tabStyle={{width: 'auto'}}
    />
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleBackPress = () => {
    (navigation as any).goBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeftIcon size={24} color={colors.darkFont} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={colors.grayFont} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search guests, residents, or vehicles..."
            placeholderTextColor={colors.grayFont}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}>
              <Icon name="times" size={24} color={colors.grayFont} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabArea}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.whiteBg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.darkFont,
  },
  clearButton: {
    paddingHorizontal: 4,
    paddingVertical: 0,
  },
  tabArea: {
    flex: 1,
    paddingHorizontal: 16,
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
});

export default Search;
