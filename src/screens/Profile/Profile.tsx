import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import ProfileSummary from '../../components/Profile/ProfileSummary';
import ProfileMenu from '../../components/Profile/ProfileMenu';

const Profile = () => {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <SafeAreaView style={styles.safeArea}>
          {/* <View style={styles.topbar}>
        <Text style={styles.title}>Profile</Text>
      </View> */}
          <ProfileSummary />
          <ProfileMenu />
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
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginTop: 16,
    marginBottom: 16,
  },
  scrollView: {
    flexGrow: 1,

    backgroundColor: colors.grayBg,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.whiteBg,
  },
});

export default Profile;
