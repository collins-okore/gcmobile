import {StyleSheet, ScrollView, View, StatusBar} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../themes/colors';
import Topbar from '../../components/Home/Topbar';
import UpcomingGuests from '../../components/Home/UpcomingGuests';
import PastGuests from '../../components/Home/PastGuests';
import QuickAccess from '../../components/Home/QuickAccess';

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
          <QuickAccess />
          <UpcomingGuests />
          <PastGuests />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {},
  scrollContent: {
    flexGrow: 1,
  },
});

export default Home;
