import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Text,
  Platform,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import React, {useState} from 'react';
import {Toast} from 'toastify-react-native';
import residentGuestService from '../../services/residentGuestService';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import {useNavigation} from '@react-navigation/native';
import Icon from '../../components/Common/Icon';
import TextInput from '../../components/Common/Textinput/index';
import DropdownInput from '../../components/Common/DropdownInput/index';
import DateTimeInput from '../../components/Common/DateTimeInput/index';
import Button from '../../components/Common/Button/index';
import PhoneInput from '../../components/Common/PhoneInput/index';

const AddGuest = () => {
  const navigation = useNavigation();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
    phoneCountryCode: 'KE', // Default to Kenya country code
    phoneCallingCode: '+254', // Default to Kenya calling code
    purpose: '',
    arrivalTime: new Date(),
    vehicleLicensePlate: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 0);
  };

  const handleInputChange = (field: string) => (value: string | Date) => {
    setFormData(prev => ({...prev, [field]: value}));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const handlePhoneChange = (phone: string) => {
    setFormData(prev => ({...prev, phone}));

    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({...prev, phone: ''}));
    }
  };

  const handleCallingCodeChange = (callingCode: string) => {
    setFormData(prev => ({
      ...prev,
      phoneCallingCode: `+${callingCode}`,
    }));
  };

  const handleCountryCodeChange = (countryCode: string) => {
    setFormData(prev => ({
      ...prev,
      phoneCountryCode: countryCode,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (formData.phone.trim()) {
      // Validate local phone number (without country code)
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      if (!/^[0-9]{8,12}$/.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid phone number (8-12 digits)';
      }
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddGuest = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API
      const guestData = {
        name: formData.fullName.trim(),
        ...(formData.phone.trim() && {
          phone: formData.phone.trim(),
          phoneCountryCode: formData.phoneCountryCode, // "KE", "US", etc.
          phoneCallingCode: formData.phoneCallingCode, // "+254", "+27", etc.
        }),
        ...(formData.idNumber.trim() && {
          idNumber: formData.idNumber.trim(),
        }),
        purpose: formData.purpose,
        arrivalTime: formData.arrivalTime.toISOString(),
        ...(formData.vehicleLicensePlate.trim() && {
          vehicleLicensePlate: formData.vehicleLicensePlate.trim(),
        }),
        ...(formData.vehicleMake.trim() && {
          vehicleMake: formData.vehicleMake.trim(),
        }),
        ...(formData.vehicleModel.trim() && {
          vehicleModel: formData.vehicleModel.trim(),
        }),
        ...(formData.vehicleColor.trim() && {
          vehicleColor: formData.vehicleColor.trim(),
        }),
      };

      await residentGuestService.createResidentGuest(guestData);

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Guest Added Successfully!',
        text2: `${formData.fullName} has been registered as your guest.`,
        position: 'top',
        visibilityTime: 3000,
      });

      // Navigate back after a short delay to let user see the toast
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error('Error adding guest:', error);

      let errorMessage = 'Failed to add guest. Please try again.';

      if (error.response) {
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
            }
          }
        } else if (error.response.status === 409) {
          errorMessage = 'A guest with this ID number already exists.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage =
          'Network error. Please check your connection and try again.';
      }

      Toast.show({
        type: 'error',
        text1: 'Failed to Add Guest',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const purposeOptions = [
    {label: 'Business Meeting', value: 'Business Meeting'},
    {label: 'Personal Visit', value: 'Personal Visit'},
    {label: 'Delivery', value: 'Delivery'},
    {label: 'Maintenance', value: 'Maintenance'},
    {label: 'Guest/Friend', value: 'Guest/Friend'},
    {label: 'Family Visit', value: 'Family Visit'},
    {label: 'Other', value: 'Other'},
  ];

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <SafeAreaView
        style={[styles.topBar, isScrolled && styles.topBarWithBorder]}
        edges={['left', 'right', 'top']}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-left" size={23} color={colors.darkFont} />
        </TouchableOpacity>
      </SafeAreaView>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
          <View style={styles.header}>
            <Text style={styles.title}>New Visit</Text>
            <Text style={styles.subtitle}>
              Register your guest by filling out their details.
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <TextInput
                label="Full Name"
                placeholder="Enter guest's full name"
                value={formData.fullName}
                onChangeText={handleInputChange('fullName')}
                error={errors.fullName}
                required
                testID="full-name-input"
              />

              <TextInput
                label="ID Number"
                placeholder="Enter ID/Passport number (optional)"
                value={formData.idNumber}
                onChangeText={handleInputChange('idNumber')}
                error={errors.idNumber}
                testID="id-number-input"
              />

              <PhoneInput
                label="Phone Number"
                placeholder="Enter phone number (optional)"
                value={formData.phone}
                onChangeText={handlePhoneChange}
                onChangeCallingCode={handleCallingCodeChange}
                onChangeCountryCode={handleCountryCodeChange}
                defaultCode={formData.phoneCountryCode || 'KE'}
                error={errors.phone}
                testID="phone-input"
                key={formData.phoneCallingCode}
              />
            </View>

            {/* Visit Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Visit Information</Text>

              <DropdownInput
                label="Purpose of Visit"
                placeholder="Select purpose"
                value={formData.purpose}
                onSelect={handleInputChange('purpose')}
                options={purposeOptions}
                error={errors.purpose}
                required
                testID="purpose-dropdown"
              />

              <DateTimeInput
                label="Expected Arrival Date & Time"
                value={formData.arrivalTime}
                onChange={handleInputChange('arrivalTime')}
                mode="datetime"
                testID="arrival-time-picker"
              />
            </View>

            {/* Vehicle Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Information</Text>
              <Text style={styles.sectionSubtitle}>
                Optional - Fill if guest has a vehicle
              </Text>

              <TextInput
                label="License Plate"
                placeholder="Enter vehicle license plate"
                value={formData.vehicleLicensePlate}
                onChangeText={handleInputChange('vehicleLicensePlate')}
                testID="license-plate-input"
              />

              <TextInput
                label="Vehicle Make"
                placeholder="e.g., Toyota, BMW, Honda"
                value={formData.vehicleMake}
                onChangeText={handleInputChange('vehicleMake')}
                testID="vehicle-make-input"
              />

              <TextInput
                label="Vehicle Model"
                placeholder="e.g., Camry, X5, Civic"
                value={formData.vehicleModel}
                onChangeText={handleInputChange('vehicleModel')}
                testID="vehicle-model-input"
              />

              <TextInput
                label="Vehicle Color"
                placeholder="Enter vehicle color"
                value={formData.vehicleColor}
                onChangeText={handleInputChange('vehicleColor')}
                testID="vehicle-color-input"
              />
            </View>

            {/* Bottom spacing for fixed button */}
            <View style={styles.bottomSpacing} />
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Fixed Add Guest Button */}
      <SafeAreaView style={styles.buttonSafeArea} edges={['bottom']}>
        <View style={styles.buttonContainer}>
          <Button
            title="Generate Pass"
            onPress={handleAddGuest}
            loading={isLoading}
            disabled={isLoading}
            testID="add-guest-button"
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for fixed button
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    marginBottom: 24,
    marginTop: 4,
  },
  topBar: {
    backgroundColor: colors.whiteBg,
  },
  topBarWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    paddingVertical: 8,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
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
});

export default AddGuest;
