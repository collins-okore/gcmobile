import {StyleSheet, ScrollView, View, StatusBar} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../themes/colors';
import Topbar from '../../../components/Home/Topbar';
import SecurityQuickAccess from './SecurityQuickAccess';

const SecurityCheckIn = () => {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollContent}>
        <SafeAreaView style={styles.safeArea}>
          <Topbar />
          <SecurityQuickAccess />
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

export default SecurityCheckIn;
