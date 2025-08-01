import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from './Icon';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import {format, isThisYear} from 'date-fns';

interface TimelineItem {
  status: string;
  timestamp: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  isActive: boolean;
}

interface GuestTimelineProps {
  guest: {
    status: string;
    createdAt: string;
    arrivalTime: string;
    departureTime?: string;
    cancelledAt?: string;
  };
}

const GuestTimeline: React.FC<GuestTimelineProps> = ({guest}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const time = format(date, 'HH:mm');

    if (isThisYear(date)) {
      return `${format(date, 'do MMM')} · ${time}`;
    }

    return `${format(date, 'dd MMM yyyy')} · ${time}`;
  };

  const getTimelineItems = (): TimelineItem[] => {
    const items: TimelineItem[] = [];

    // Always show booked status
    items.push({
      status: 'booked',
      timestamp: guest.createdAt,
      title: 'Booked',
      description: 'Guest visit was scheduled',
      icon: 'calendar-plus',
      iconColor: '#2196F3',
      isActive:
        guest.status === 'pending' ||
        guest.status === 'arrived' ||
        guest.status === 'departed',
    });

    // Show checked in if arrived or departed
    if (guest.status === 'arrived' || guest.status === 'departed') {
      items.push({
        status: 'arrived',
        timestamp: guest.arrivalTime,
        title: 'Checked In',
        description: 'Guest arrived at the estate',
        icon: 'sign-in-alt',
        iconColor: '#4CAF50',
        isActive: guest.status === 'arrived' || guest.status === 'departed',
      });
    }

    // Show checked out if departed
    if (guest.status === 'departed' && guest.departureTime) {
      items.push({
        status: 'departed',
        timestamp: guest.departureTime,
        title: 'Checked Out',
        description: 'Guest left the estate',
        icon: 'sign-out-alt',
        iconColor: '#FF9800',
        isActive: true,
      });
    }

    // Show cancelled if cancelled
    if (guest.status === 'cancelled') {
      items.push({
        status: 'cancelled',
        timestamp: guest.cancelledAt || guest.createdAt,
        title: 'Cancelled',
        description: 'Guest visit was cancelled',
        icon: 'times-circle',
        iconColor: '#F44336',
        isActive: true,
      });
    }

    return items;
  };

  const timelineItems = getTimelineItems();

  if (timelineItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Guest Timeline</Text>
      </View>

      <View style={styles.timeline}>
        {timelineItems.map((item, index) => (
          <View key={item.status} style={styles.timelineItem}>
            {/* Timeline line */}
            {index < timelineItems.length - 1 && (
              <View
                style={[styles.timelineLine, {backgroundColor: '#E0E0E0'}]}
              />
            )}

            {/* Icon container */}
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: item.isActive
                    ? item.iconColor + '20'
                    : '#F5F5F5',
                },
              ]}>
              <Icon
                name={item.icon}
                size={20}
                color={item.isActive ? item.iconColor : '#BDBDBD'}
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text
                style={[
                  styles.itemTitle,
                  {color: item.isActive ? colors.darkFont : '#BDBDBD'},
                ]}>
                {item.title}
              </Text>
              <Text
                style={[
                  styles.description,
                  {color: item.isActive ? colors.grayFont : '#BDBDBD'},
                ]}>
                {item.description}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  {color: item.isActive ? colors.grayFont : '#BDBDBD'},
                ]}>
                {formatDate(item.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whiteBg,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.darkFont,
  },
  timeline: {
    paddingBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  timelineLine: {
    position: 'absolute',
    left: 20,
    top: 40,
    width: 2,
    height: 40,
    zIndex: 1,
    marginTop: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    zIndex: 2,
  },
  content: {
    flex: 1,
    paddingTop: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
});

export default GuestTimeline;
