import React, {useState} from 'react';
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
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import TextInput from '../../components/Common/Textinput/index';
import Button from '../../components/Common/Button/index';
import residentVehicleService from '../../services/residentVehicleService';
import authService from '../../services/authService';

interface VehicleFormData {
  license_plate: string;
  make: string;
  model: string;
  color: string;
}

interface FormErrors {
  license_plate?: string;
  make?: string;
  model?: string;
  color?: string;
}

const AddVehicle = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState<VehicleFormData>({
    license_plate: '',
    make: '',
    model: '',
    color: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInputChange =
    (field: keyof VehicleFormData) => (value: string) => {
      setFormData(prev => ({...prev, [field]: value}));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({...prev, [field]: undefined}));
      }
    };

  const validatePlateNumber = (plateNumber: string): boolean => {
    if (!plateNumber.trim()) return false;
    // Basic validation - at least 3 characters, alphanumeric and hyphens
    const plateRegex = /^[A-Za-z0-9\-]{3,}$/;
    return plateRegex.test(plateNumber.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // License plate validation (required)
    if (!formData.license_plate.trim()) {
      newErrors.license_plate = 'License plate is required';
    } else if (!validatePlateNumber(formData.license_plate)) {
      newErrors.license_plate =
        'Please enter a valid plate number (at least 3 characters)';
    }

    // Make validation (required)
    if (!formData.make.trim()) {
      newErrors.make = 'Vehicle make is required';
    }

    // Model validation (required)
    if (!formData.model.trim()) {
      newErrors.model = 'Vehicle model is required';
    }

    // Color is optional, no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddVehicle = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Get user profile to get estate_id
      const profile = await authService.getProfile();

      // Prepare vehicle data
      const vehicleData = {
        license_plate: formData.license_plate.trim(),
        make: formData.make.trim(),
        model: formData.model.trim(),
        ...(formData.color.trim() && {color: formData.color.trim()}),
        estate_id: profile.estate_name || '1', // Use estate_name or fallback
      };

      await residentVehicleService.createVehicle(vehicleData);

      Toast.show({
        type: 'success',
        text1: 'Vehicle Added Successfully!',
        text2: `${formData.make} ${formData.model} has been registered`,
        position: 'top',
        visibilityTime: 3000,
      });

      // Navigate back after a short delay to show the toast
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error('Error adding vehicle:', error);

      let errorMessage = 'Failed to add vehicle. Please try again.';

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
          errorMessage = 'A vehicle with this license plate already exists.';
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
        text1: 'Failed to Add Vehicle',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
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
            <Text style={styles.title}>Add Vehicle</Text>
            <Text style={styles.subtitle}>
              Register a new vehicle to your profile
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Vehicle Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Information</Text>

              <TextInput
                label="License Plate"
                placeholder="Enter plate number (e.g., ABC-123)"
                value={formData.license_plate}
                onChangeText={handleInputChange('license_plate')}
                error={errors.license_plate}
                required
                autoCapitalize="characters"
                testID="license-plate-input"
              />

              <TextInput
                label="Vehicle Make"
                placeholder="Enter vehicle make (e.g., Toyota, Honda)"
                value={formData.make}
                onChangeText={handleInputChange('make')}
                error={errors.make}
                required
                autoCapitalize="words"
                testID="vehicle-make-input"
              />

              <TextInput
                label="Vehicle Model"
                placeholder="Enter vehicle model (e.g., Camry, Civic)"
                value={formData.model}
                onChangeText={handleInputChange('model')}
                error={errors.model}
                required
                autoCapitalize="words"
                testID="vehicle-model-input"
              />

              <TextInput
                label="Vehicle Color"
                placeholder="Enter vehicle color (optional)"
                value={formData.color}
                onChangeText={handleInputChange('color')}
                error={errors.color}
                autoCapitalize="words"
                testID="vehicle-color-input"
              />
            </View>

            {/* Bottom spacing for fixed button */}
            <View style={styles.bottomSpacing} />
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Fixed Add Button */}
      <SafeAreaView style={styles.buttonSafeArea} edges={['bottom']}>
        <View style={styles.buttonContainer}>
          <Button
            title="Add Vehicle"
            onPress={handleAddVehicle}
            loading={isLoading}
            disabled={isLoading}
            testID="add-vehicle-button"
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
});

export default AddVehicle;
