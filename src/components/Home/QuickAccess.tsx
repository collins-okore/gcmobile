import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
} from 'react-native-heroicons/outline';
import {PlusIcon as PlusIconSolid} from 'react-native-heroicons/solid';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';

const QuickAccess = () => {
  const navigation = useNavigation();

  const handleNewVisitPress = () => {
    navigation.navigate('ResidentGuests' as never);
  };

  // Placeholders for other actions
  const handlePress = (action: string) => {
    console.log(`${action} pressed`);
  };

  const actions = [
    {
      id: 1,
      label: 'New Visit',
      icon: <PlusIconSolid color="white" size={28} />,
      onPress: handleNewVisitPress,
      isPrimary: true,
    },
    {
      id: 2,
      label: 'Report',
      icon: <WrenchScrewdriverIcon color={colors.grayFont} size={24} />,
      onPress: () => handlePress('Report'),
    },
    {
      id: 3,
      label: 'Concierge',
      icon: <ChatBubbleLeftRightIcon color={colors.grayFont} size={24} />,
      onPress: () => handlePress('Concierge'),
    },
    {
      id: 4,
      label: 'Notices',
      icon: <DocumentTextIcon color={colors.grayFont} size={24} />,
      onPress: () => handlePress('Notices'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quick Actions</Text>
        <TouchableOpacity>
          <EllipsisHorizontalIcon color={colors.grayIconColor} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        {actions.map(action => (
          <View key={action.id} style={styles.actionItem}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                action.isPrimary
                  ? styles.primaryButton
                  : styles.secondaryButton,
              ]}
              onPress={action.onPress}
              activeOpacity={0.8}>
              {action.icon}
            </TouchableOpacity>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 32, // Increased from 24
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // Increased spacing
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.darkFont,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    width: 70, // Fixed width for alignment
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12, // Increased spacing
    // Shadows
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.whiteBg,
    borderWidth: 1,
    borderColor: '#f8fafc',
  },
  actionLabel: {
    fontSize: 14, // Increased font size
    fontFamily: fonts.semibold,
    color: colors.grayFont,
    textAlign: 'center',
  },
});

export default QuickAccess;
