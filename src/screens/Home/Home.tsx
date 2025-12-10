import {StyleSheet, ScrollView, View, StatusBar} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../themes/colors';
import Topbar from '../../components/Home/Topbar';
import QuickAccess from '../../components/Home/QuickAccess';
import ResidentPassCard from '../../components/Home/ResidentPassCard';
import InfoCards from '../../components/Home/InfoCards';
import RecentActivity from '../../components/Home/RecentActivity';

const Home = () => {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollContent}>
        <SafeAreaView style={styles.safeArea}>
          <Topbar />
          <ResidentPassCard />
          <InfoCards />
          <QuickAccess />
          <RecentActivity />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Slightly gray background to make white cards pop
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
