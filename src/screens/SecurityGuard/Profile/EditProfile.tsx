import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import {Toast} from 'toastify-react-native';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import TextInput from '../../../components/Common/Textinput/index';
import Button from '../../../components/Common/Button/index';
import PhoneInput from '../../../components/Common/PhoneInput/index';
import authService from '../../../services/authService';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  phone_country_code: string; // Country code like "KE", "US"
  phone_calling_code: string; // Calling code like "+254", "+27"
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  phone_country_code?: string;
  phone_calling_code?: string;
}

const EditProfile = () => {
  const navigation = useNavigation();

  // Initialize with empty data - will be loaded from API
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    phone_country_code: 'KE', // Default to Kenya country code
    phone_calling_code: '+254', // Default to Kenya calling code
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      const profileData = await authService.getProfile();
      console.log('Profile Data', profileData);

      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        phone_country_code: profileData.phone_country_code || 'KE',
        phone_calling_code: profileData.phone_calling_code || '+254',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to load profile',
        text2: 'Please try again later',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInputChange =
    (field: keyof ProfileFormData) => (value: string) => {
      setFormData(prev => ({...prev, [field]: value}));

      // Clear error when user starts typing
      if (errors[field]) {
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
    const phoneRegex = /^[0-9]{8,12}$/;
    return phoneRegex.test(cleanPhone);
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
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional)
    if (formData.phone.trim() && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (8-12 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare profile data (exclude phone fields if phone is empty)
      const profileData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        ...(formData.phone.trim() && {
          phone: formData.phone.trim(),
          phone_country_code: formData.phone_country_code, // "KE", "US", etc.
          phone_calling_code: formData.phone_calling_code, // "+254", "+27", etc.
        }),
      };

      await authService.updateProfile(profileData);

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been successfully updated',
        position: 'top',
        visibilityTime: 3000,
      });

      // Navigate back after a short delay to show the toast
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error('Failed to update profile:', error);

      let errorMessage = 'Failed to update profile. Please try again.';

      // Handle specific error cases
      if (error.response?.status === 400) {
        errorMessage = 'Invalid profile data. Please check your information.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Email address is already taken.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Please check your input and try again.';
      }

      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while profile data is being loaded
  if (isLoadingProfile) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Profile</Text>
          </View>

          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.subtitle}>
              Update your personal information below.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
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

            {/* Bottom spacing for fixed button */}
            <View style={styles.bottomSpacing} />
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Fixed Save Button */}
      <SafeAreaView style={styles.buttonSafeArea} edges={['bottom']}>
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            onPress={handleSaveProfile}
            loading={isLoading}
            disabled={isLoading}
            testID="save-profile-button"
          />
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
    paddingBottom: 100, // Space for fixed button
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 0,
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginLeft: 4,
    marginTop: 4,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
});

export default EditProfile;
