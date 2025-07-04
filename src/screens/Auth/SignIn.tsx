import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Text,
  Alert,
} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import TextInput from '../../components/Common/Textinput/index';
import Button from '../../components/Common/Button/index';

interface SignInFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  FPassword: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const SignIn = () => {
  const navigation = useNavigation<NavigationProp>();
  const {login: authLogin, error: authError, clearError} = useAuth();

  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate('FPassword');
  };

  const handleInputChange =
    (field: keyof SignInFormData) => (value: string) => {
      setFormData(prev => ({...prev, [field]: value}));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({...prev, [field]: undefined}));
      }
    };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation (required)
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (required)
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Clear any previous auth errors
    clearError();

    try {
      // Use the context login method
      await authLogin({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Login successful - navigation will happen automatically via AuthStateNavigator
      Alert.alert('Welcome Back!', 'You have been successfully signed in.', [
        {
          text: 'Continue',
          onPress: () => {
            // Navigation will be handled automatically by AuthStateNavigator
            console.log('User signed in successfully');
          },
        },
      ]);
    } catch (error: any) {
      // Error handling is already done in the context
      // Just show the error from context or fallback message
      Alert.alert(
        'Sign In Failed',
        authError || 'An unexpected error occurred. Please try again.',
        [{text: 'OK'}],
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              👋 Sign in to your Gate Connect account
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Sign In Form Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Information</Text>

              <TextInput
                label="Email Address"
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={handleInputChange('email')}
                mode="email"
                error={errors.email}
                required
                autoCapitalize="none"
                testID="email-input"
              />

              <TextInput
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={handleInputChange('password')}
                error={errors.password}
                required
                secureTextEntry
                testID="password-input"
              />

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={handleForgotPasswordPress}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom spacing for fixed button */}
            <View style={styles.bottomSpacing} />
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Fixed Sign In Button */}
      <SafeAreaView style={styles.buttonSafeArea} edges={['bottom']}>
        <View style={styles.buttonContainer}>
          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={isLoading}
            disabled={isLoading}
            testID="sign-in-button"
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUpPress}>
              <Text style={styles.signUpLink}>Create Account</Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Space for fixed button
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 32,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    lineHeight: 22,
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  bottomSpacing: {
    height: 40,
  },
  buttonSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.whiteBg,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.whiteBg,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  signUpLink: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
});

export default SignIn;
