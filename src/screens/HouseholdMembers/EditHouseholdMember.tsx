import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Toast} from 'toastify-react-native';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import TextInput from '../../components/Common/Textinput/index';
import PhoneInput from '../../components/Common/PhoneInput/index';
import DropdownInput from '../../components/Common/DropdownInput/index';
import Button from '../../components/Common/Button/index';
import residentHouseholdMemberService from '../../services/residentHouseholdMemberService';
import {normalize} from '../../lib/normalize';

interface HouseholdMemberFormData {
  name: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  phoneCallingCode: string;
  relationship: 'Spouse' | 'Child' | 'Other' | '';
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

const EditHouseholdMember = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [formData, setFormData] = useState<HouseholdMemberFormData>({
    name: '',
    email: '',
    phone: '',
    phoneCountryCode: 'KE',
    phoneCallingCode: '+254',
    relationship: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const loadMemberData = useCallback(async () => {
    try {
      const memberId = (route.params as any)?.memberId;

      if (!memberId) {
        Toast.error('Member ID not found');
        navigation.goBack();
        return;
      }

      const response =
        await residentHouseholdMemberService.getHouseholdMemberById(memberId);

      const memberData = normalize(response.data);

      setFormData({
        name: memberData.name || '',
        email: memberData.email || '',
        phone: memberData.phone || '',
        phoneCountryCode: memberData.phoneCountryCode || 'KE',
        phoneCallingCode: memberData.phoneCallingCode || '+254',
        relationship: memberData.relationship || '',
      });
    } catch (error) {
      console.error('Failed to load member data:', error);
      Toast.error('Failed to load member data');
    } finally {
      setIsDataLoading(false);
    }
  }, [route.params, navigation]);

  useEffect(() => {
    loadMemberData();
  }, [loadMemberData]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInputChange =
    (field: keyof HouseholdMemberFormData) => (value: string) => {
      setFormData(prev => ({...prev, [field]: value}));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({...prev, [field]: undefined}));
      }
    };

  const handlePhoneChange = (phoneNumber: string) => {
    setFormData(prev => ({...prev, phone: phoneNumber}));
    if (errors.phone) {
      setErrors(prev => ({...prev, phone: undefined}));
    }
  };

  const handleCallingCodeChange = (callingCode: string) => {
    setFormData(prev => ({
      ...prev,
      phoneCallingCode: callingCode,
    }));
  };

  const handleCountryCodeChange = (countryCode: string) => {
    setFormData(prev => ({
      ...prev,
      phoneCountryCode: countryCode,
    }));
  };

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return true; // Phone is optional
    const phoneRegex = /^[0-9]{8,12}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation (required)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation (optional)
    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional)
    if (formData.phone.trim() && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (8-12 digits)';
    }

    // Relationship validation (required)
    if (!formData.relationship) {
      newErrors.relationship = 'Relationship is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateMember = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const memberId = (route.params as any)?.memberId;

      if (!memberId) {
        Toast.error('Member ID not found');
        navigation.goBack();
        return;
      }

      // Prepare data for API
      const memberData = {
        name: formData.name.trim(),
        relationship: formData.relationship as 'Spouse' | 'Child' | 'Other',
        ...(formData.phone.trim() && {phone: formData.phone.trim()}),
        ...(formData.email.trim() && {email: formData.email.trim()}),
        phoneCountryCode: formData.phoneCountryCode,
        phoneCallingCode: formData.phoneCallingCode,
      };

      await residentHouseholdMemberService.updateHouseholdMember(
        memberId,
        memberData,
      );

      Toast.success('Household member has been successfully updated');
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to update household member:', error);

      let errorMessage = 'Failed to update household member. Please try again.';

      if (error?.response?.status === 400) {
        errorMessage = 'Invalid member information. Please check your input.';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Session expired. Please sign in again.';
      } else if (error?.response?.status === 403) {
        errorMessage =
          'You do not have permission to update household members.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Household member not found.';
      } else if (error?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      Toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const relationshipOptions = [
    {label: 'Spouse', value: 'Spouse'},
    {label: 'Child', value: 'Child'},
    {label: 'Other', value: 'Other'},
  ];

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
            <Text style={styles.title}>Edit Household Member</Text>
            <Text style={styles.subtitle}>
              Update household member information
            </Text>
          </View>

          {/* Form */}
          {isDataLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading member data...</Text>
            </View>
          ) : (
            <View style={styles.formContainer}>
              {/* Personal Information Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <TextInput
                  label="Name"
                  placeholder="Enter member's name"
                  value={formData.name}
                  onChangeText={handleInputChange('name')}
                  error={errors.name}
                  required
                  autoCapitalize="words"
                  testID="name-input"
                />

                <TextInput
                  label="Email Address"
                  placeholder="Enter email address (optional)"
                  value={formData.email}
                  onChangeText={handleInputChange('email')}
                  mode="email"
                  error={errors.email}
                  autoCapitalize="none"
                  testID="email-input"
                />

                <PhoneInput
                  label="Phone Number"
                  placeholder="Enter phone number (optional)"
                  value={formData.phone}
                  onChangeText={handlePhoneChange}
                  onChangeCallingCode={handleCallingCodeChange}
                  onChangeCountryCode={handleCountryCodeChange}
                  defaultCode={formData.phoneCountryCode}
                  error={errors.phone}
                  testID="phone-input"
                />

                <DropdownInput
                  label="Relationship"
                  placeholder="Select relationship"
                  value={formData.relationship}
                  onSelect={handleInputChange('relationship')}
                  options={relationshipOptions}
                  error={errors.relationship}
                  required
                  testID="relationship-dropdown"
                />
              </View>

              {/* Bottom spacing for fixed button */}
              <View style={styles.bottomSpacing} />
            </View>
          )}
        </SafeAreaView>
      </ScrollView>

      {/* Fixed Update Button */}
      <SafeAreaView style={styles.buttonSafeArea} edges={['bottom']}>
        <View style={styles.buttonContainer}>
          <Button
            title="Update Member"
            onPress={handleUpdateMember}
            loading={isLoading}
            disabled={isLoading}
            testID="update-member-button"
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
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
});

export default EditHouseholdMember;
