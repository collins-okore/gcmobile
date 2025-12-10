/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import React from 'react';
import colors from '../../themes/colors';
import TopBar from '../../components/Guests/TopBar';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import UpcomingGuestsTab from './UpcomingGuestsTab';
import PastGuestTab from './PastGuestTab';
import {SafeAreaView} from 'react-native-safe-area-context';
import fonts from '../../themes/fonts';

const renderScene = SceneMap({
  upcoming: UpcomingGuestsTab,
  past: PastGuestTab,
});

const routes = [
  {key: 'upcoming', title: 'Upcoming'},
  {key: 'past', title: 'Past'},
];

const Visits = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.primary,
        height: 3, // Thickened indicator
        borderRadius: 1.5,
      }}
      style={{
        backgroundColor: colors.whiteBg,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: 10,
      }}
      labelStyle={{
        textTransform: 'none',
        fontFamily: fonts.semibold,
        fontSize: 16, // Adjusted font size
      }}
      activeColor={colors.primary} // Blue when active
      inactiveColor={colors.grayFont}
      tabStyle={{width: 'auto', paddingHorizontal: 20}}
      pressColor={'transparent'}
    />
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <TopBar title="Visits" />
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
  tabArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 0, // Removed padding to let tabs stretch full width
  },
});

export default Visits;
