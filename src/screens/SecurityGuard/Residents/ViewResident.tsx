import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import securityGuardGuestService from '../../../services/securityGuardGuestService';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import {normalize} from '../../../lib/normalize';

const ViewResident = () => {
  const route = useRoute();
  const {residentId} = route.params as {residentId: string};
  const [resident, setResident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResident = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await securityGuardGuestService.getResidentById(
          residentId,
          {populate: ['user']},
        );
        setResident(normalize(response));
      } catch (err: any) {
        setError('Failed to load resident details.');
      } finally {
        setLoading(false);
      }
    };
    if (residentId) fetchResident();
  }, [residentId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading resident details...</Text>
      </View>
    );
  }
  if (error || !resident) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Resident not found'}</Text>
      </View>
    );
  }
  const user = resident.user || {};
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.label}>House:</Text>
        <Text style={styles.value}>
          {resident.houseNumber}
          {resident.unit ? `, Unit ${resident.unit}` : ''}
        </Text>
        {resident.blockCourt && (
          <React.Fragment>
            <Text style={styles.label}>Block/Court:</Text>
            <Text style={styles.value}>{resident.blockCourt}</Text>
          </React.Fragment>
        )}
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{user.phone || '-'}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email || '-'}</Text>
        <Text style={styles.label}>Household Size:</Text>
        <Text style={styles.value}>{resident.householdSize || '-'}</Text>
        {resident.householdMembers &&
          Array.isArray(resident.householdMembers) &&
          resident.householdMembers.length > 0 && (
            <React.Fragment>
              <Text style={styles.label}>Household Members:</Text>
              {resident.householdMembers.map((member: any) => (
                <Text style={styles.value} key={member.id}>
                  - {member.name} ({member.relationship})
                </Text>
              ))}
            </React.Fragment>
          )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.whiteBg,
  },
  card: {
    width: '100%',
    backgroundColor: colors.whiteBg,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.primary,
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.darkFont,
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.whiteBg,
  },
  loadingText: {
    fontSize: 16,
    color: colors.grayFont,
    marginTop: 16,
    fontFamily: fonts.regular,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5252',
    fontFamily: fonts.regular,
  },
});

export default ViewResident;
