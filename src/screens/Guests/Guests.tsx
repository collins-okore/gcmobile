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

const Guests = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

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
        textTransform: 'none', // Prevents automatic uppercase
        fontFamily: fonts.semibold,
        fontSize: 18,
      }}
      activeColor={colors.darkFont}
      inactiveColor={colors.grayFont}
      tabStyle={{width: 'auto'}}
    />
  );

  return (
    <SafeAreaView style={styles.screen}>
      <TopBar />
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
    paddingHorizontal: 16,
  },
});

export default Guests;
