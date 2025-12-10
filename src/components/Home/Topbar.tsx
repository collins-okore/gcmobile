import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BellIcon} from 'react-native-heroicons/outline';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import {useAuth} from '../../contexts/AuthContext';

const Topbar = () => {
  const {user} = useAuth();

  // Format user name
  const userName = user
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`.trim()
    : 'Guest';

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Good Morning,</Text>
        <Text style={styles.name}>{userName}</Text>
      </View>
      
      <TouchableOpacity style={styles.notificationButton}>
        <BellIcon color={colors.darkFont} size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.whiteBg,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
});

export default Topbar;
