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
import React, {useState, useCallback} from 'react';
import {Toast} from 'toastify-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import TextInput from '../../../components/Common/Textinput/index';
import DropdownInput from '../../../components/Common/DropdownInput/index';
import SearchableDropdown from '../../../components/Common/SearchableDropdown/index';
import DateTimeInput from '../../../components/Common/DateTimeInput/index';
import Button from '../../../components/Common/Button/index';
import PhoneInput from '../../../components/Common/PhoneInput/index';
import securityGuardGuestService from '../../../services/securityGuardGuestService';
import {normalize} from '../../../lib/normalize';
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
    departureTime: new Date(),
    vehicleLicensePlate: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    residentId: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [residents, setResidents] = useState<
    Array<{label: string; value: string}>
  >([]);
  const [isLoadingResidents, setIsLoadingResidents] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadResidents = useCallback(async () => {
    try {
      setIsLoadingResidents(true);
      const response = await securityGuardGuestService.getAllResidents({
        pagination: {
          page: 1,
          pageSize: 1000, // Get all residents
        },
        populate: ['user'],
      });
      const residentResponseData = normalize(response);

      const residentOptions = residentResponseData.map((resident: any) => {
        return {
          label: `${resident.blockCourt}, ${resident.houseNumber} - ${resident.user.firstName} ${resident.user.lastName}`,
          value: `${resident.id}`,
        };
      });

      setResidents(residentOptions);
    } catch (error) {
      console.error('Error loading residents:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Load Residents',
        text2: 'Failed to load residents. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoadingResidents(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadResidents();
    }, [loadResidents]),
  );

  const handleBackPress = () => {
    navigation.goBack();
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

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Validate local phone number (without country code)
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      if (!/^[0-9]{8,12}$/.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid phone number (8-12 digits)';
      }
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    if (!formData.residentId.trim()) {
      newErrors.residentId = 'Please select a resident';
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
      const guestData = {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        phoneCountryCode: formData.phoneCountryCode,
        phoneCallingCode: formData.phoneCallingCode,
        idNumber: formData.idNumber.trim(),
        purpose: formData.purpose,
        arrivalTime: formData.arrivalTime.toISOString(),
        departureTime: formData.departureTime.toISOString(),
        resident: formData.residentId,
        vehicleLicensePlate: formData.vehicleLicensePlate.trim() || undefined,
        vehicleMake: formData.vehicleMake.trim() || undefined,
        vehicleModel: formData.vehicleModel.trim() || undefined,
        vehicleColor: formData.vehicleColor.trim() || undefined,
      };

      await securityGuardGuestService.createGuest(guestData);

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Guest Added Successfully!',
        text2: `${formData.fullName} has been registered as a guest.`,
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
    {label: 'Business Meeting', value: 'business'},
    {label: 'Personal Visit', value: 'personal'},
    {label: 'Delivery', value: 'delivery'},
    {label: 'Maintenance', value: 'maintenance'},
    {label: 'Guest/Friend', value: 'guest'},
    {label: 'Family Visit', value: 'family'},
    {label: 'Other', value: 'other'},
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
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <Text style={styles.title}>Add Guest</Text>
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
                placeholder="Enter ID/Passport number"
                value={formData.idNumber}
                onChangeText={handleInputChange('idNumber')}
                error={errors.idNumber}
                required
                testID="id-number-input"
              />

              <PhoneInput
                label="Phone Number"
                placeholder="Enter phone number"
                value={formData.phone}
                onChangeText={handlePhoneChange}
                onChangeCallingCode={handleCallingCodeChange}
                onChangeCountryCode={handleCountryCodeChange}
                defaultCode={formData.phoneCountryCode || 'KE'}
                error={errors.phone}
                required
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
                label="Arrival Date & Time"
                value={formData.arrivalTime}
                onChange={handleInputChange('arrivalTime')}
                mode="datetime"
                testID="arrival-time-picker"
              />

              <DateTimeInput
                label="Departure Date & Time"
                value={formData.departureTime}
                onChange={handleInputChange('departureTime')}
                mode="datetime"
                testID="departure-time-picker"
              />
            </View>

            {/* Resident Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resident Information</Text>

              <SearchableDropdown
                label="Select Resident"
                placeholder="Search for a resident..."
                searchPlaceholder="Search by name or house number..."
                value={formData.residentId}
                onSelect={handleInputChange('residentId')}
                options={residents}
                error={errors.residentId}
                loading={isLoadingResidents}
                required
                emptyMessage="No residents found"
                testID="resident-dropdown"
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
            title="Add Guest"
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
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 8,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    alignSelf: 'flex-start',
    marginBottom: 0,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginTop: 4,
    paddingHorizontal: 16,
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
