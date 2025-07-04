import {Text, StyleSheet, View, StatusBar, Dimensions} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import Button from '../../components/Common/Button/index';
import GoldenGateBridge from '../../assets/images/goldern_gate_bridge.svg';

type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  FPassword: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const {width} = Dimensions.get('window');

const Welcome = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Section with Logo and Branding */}
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            {/* @ts-ignore */}
            <GoldenGateBridge width={width * 0.8} height={200} />
          </View>

          <View style={styles.brandingContainer}>
            <Text style={styles.appName}>Gate Connect</Text>
            <Text style={styles.tagline}>
              Your gateway to seamless{'\n'}community living
            </Text>
          </View>
        </View>

        {/* Middle Section - Spacer */}
        <View style={styles.middleSection} />

        {/* Bottom Section with Action Buttons */}
        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            <Button
              title="Sign In"
              onPress={handleSignIn}
              variant="primary"
              size="large"
              testID="sign-in-button"
            />

            <View style={styles.buttonSpacing} />

            <Button
              title="Create Account"
              onPress={handleSignUp}
              variant="outline"
              size="large"
              testID="sign-up-button"
            />
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Welcome to your community platform
            </Text>
          </View>
        </View>
      </SafeAreaView>
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
    paddingHorizontal: 24,
  },
  topSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandingContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: width * 0.8,
  },
  middleSection: {
    flex: 1,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  buttonSpacing: {
    height: 16,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default Welcome;
