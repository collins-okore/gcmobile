import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Text,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import authService from '../../services/authService';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import TextInput from '../../components/Common/Textinput/index';
import PhoneInput from '../../components/Common/PhoneInput/index';
import Button from '../../components/Common/Button/index';

interface SignUpFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  phone_calling_code: string;
  phone_country_code: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  FPassword: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const SignUp = () => {
  const navigation = useNavigation<NavigationProp>();

  const [formData, setFormData] = useState<SignUpFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    phone_calling_code: '+254', // Default to Kenya calling code
    phone_country_code: 'KE', // Default to Kenya country code
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const handleInputChange =
    (field: keyof SignUpFormData) => (value: string) => {
      setFormData(prev => ({...prev, [field]: value}));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({...prev, [field]: undefined}));
      }
    };

  const handlePhoneChange = (phone: string) => {
    setFormData(prev => ({...prev, phone}));

    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({...prev, phone: undefined}));
    }
  };

  const handleCallingCodeChange = (callingCode: string) => {
    setFormData(prev => ({
      ...prev,
      phone_calling_code: `+${callingCode}`,
    }));
  };

  const handleCountryCodeChange = (countryCode: string) => {
    setFormData(prev => ({
      ...prev,
      phone_country_code: countryCode,
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return true; // Phone is optional
    // Validate local phone number (without country code)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return /^[0-9]{8,12}$/.test(cleanPhone);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation (required)
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    // Last name validation (required)
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    // Email validation (required)
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (required)
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Phone validation (optional)
    if (formData.phone.trim() && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call the register API
      await authService.register({
        firstName: formData.first_name.trim(),
        lastName: formData.last_name.trim(),
        email: formData.email.trim(),
        username: formData.email.trim(),
        phone: formData.phone.trim(),
        phoneCountryCode: formData.phone_country_code.trim(),
        phoneCallingCode: formData.phone_calling_code.trim(),
        password: formData.password,
      });

      Alert.alert(
        'Account Created Successfully!',
        `Welcome ${formData.first_name}! Your account has been created. Please sign in to continue.`,
        [
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('SignIn'),
          },
        ],
      );
    } catch (error: any) {
      // Handle different error types
      let errorMessage = 'Failed to create account. Please try again.';

      if (error.response) {
        // API returned an error response
        if (error.response.status === 422) {
          // Validation errors
          if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data?.errors) {
            // Handle validation errors object
            const errors = error.response.data.errors;
            const firstError = Object.values(errors)[0];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = firstError[0];
            } else {
              errorMessage = 'Please check your information and try again.';
            }
          } else {
            errorMessage = 'Please check your information and try again.';
          }
        } else if (error.response.status === 409) {
          // Conflict - user already exists
          errorMessage =
            'An account with this email already exists. Please sign in instead.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Network error
        errorMessage =
          'Network error. Please check your internet connection and try again.';
      }

      Alert.alert('Sign Up Failed', errorMessage, [
        {
          text: 'OK',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
    [[]];
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              🎉 Join Gate Connect and become part of our community
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <TextInput
                label="First Name"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChangeText={handleInputChange('first_name')}
                error={errors.first_name}
                required
                autoCapitalize="words"
                testID="first-name-input"
              />

              <TextInput
                label="Last Name"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChangeText={handleInputChange('last_name')}
                error={errors.last_name}
                required
                autoCapitalize="words"
                testID="last-name-input"
              />

              <PhoneInput
                label="Phone Number"
                placeholder="Enter your phone number (optional)"
                value={formData.phone}
                onChangeText={handlePhoneChange}
                onChangeCallingCode={handleCallingCodeChange}
                onChangeCountryCode={handleCountryCodeChange}
                defaultCode={formData.phone_country_code || 'KE'}
                error={errors.phone}
                testID="phone-input"
                key={formData.phone_calling_code}
              />
            </View>

            {/* Account Information Section */}
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
                placeholder="Create a strong password"
                value={formData.password}
                onChangeText={handleInputChange('password')}
                error={errors.password}
                required
                secureTextEntry
                testID="password-input"
              />
            </View>

            {/* Bottom spacing for fixed button */}
            <View style={styles.bottomSpacing} />
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Fixed Sign Up Button */}
      <SafeAreaView style={styles.buttonSafeArea} edges={['bottom']}>
        <View style={styles.buttonContainer}>
          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={isLoading}
            disabled={isLoading}
            testID="create-account-button"
          />

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignInPress}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    marginBottom: 24,
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
  bottomSpacing: {
    height: 20,
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signInText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  signInLink: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
});

export default SignUp;
