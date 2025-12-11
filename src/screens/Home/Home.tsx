import {StyleSheet, ScrollView, View, StatusBar} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Topbar from '../../components/Home/Topbar';
import QuickAccess from '../../components/Home/QuickAccess';
import ResidentPassCard from '../../components/Home/ResidentPassCard';
import InfoCards from '../../components/Home/InfoCards';
import RecentActivity from '../../components/Home/RecentActivity';
import Svg, {Defs, RadialGradient, Stop, Rect} from 'react-native-svg';

const Home = () => {
  return (
    <View style={styles.screen}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="0%" rx="100%" ry="100%">
            <Stop offset="0" stopColor="#edf2f9" stopOpacity="1" />
            <Stop offset="0.7" stopColor="#f9fafb" stopOpacity="1" />
            <Stop offset="1" stopColor="#f9fafb" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={styles.scrollContent}>
          <Topbar />
          <ResidentPassCard />
          <InfoCards />
          <QuickAccess />
          <RecentActivity />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Extra padding for bottom tab bar
  },
});

export default Home;
