import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  CubeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from 'react-native-heroicons/outline';
import {formatDistanceToNow, parseISO} from 'date-fns';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import {residentGuestService} from '../../services';
import {normalize} from '../../lib/normalize';

// Mock types until we have the full type definition available
interface Guest {
  id: string;
  name: string;
  purpose: string;
  status: 'pending' | 'arrived' | 'departed' | 'revoked' | 'cancelled';
  updatedAt: string;
  vehicleLicensePlate?: string;
  accessCode?: string; // entry code
  company?: string; // For deliveries
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivity = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch recent guests, top 10
      const response = await residentGuestService.getAllResidentGuests({
        sort: ['updatedAt:desc'],
        pagination: {
          page: 1,
          pageSize: 10,
        },
      });

      console.log('response', normalize(response.data));

      const normalizedData = normalize(response.data);

      // Filter for relevant statuses that indicate "activity"
      const recentActivities = normalizedData.filter((guest: any) => {
        return ['arrived', 'departed', 'pending'].includes(guest.status);
      });

      setActivities(recentActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecentActivity();
    }, [fetchRecentActivity]),
  );

  const renderIcon = (guest: Guest) => {
    if (guest.purpose.toLowerCase().includes('delivery')) {
      return <CubeIcon color={colors.darkFont} size={24} />;
    }
    if (guest.status === 'departed') {
      return <ArrowRightIcon color={colors.darkFont} size={24} />;
    }
    // Arrived or Pending
    return <ArrowLeftIcon color={colors.darkFont} size={24} />;
  };

  const getTitle = (guest: Guest) => {
    if (guest.purpose.toLowerCase().includes('delivery')) {
      return 'Delivery Arrived';
    }
    return guest.name;
  };

  const getSubtitle = (guest: Guest) => {
    if (guest.purpose.toLowerCase().includes('delivery')) {
      // Placeholder gate, in real app might come from gate data
      return `Gate 1 • ${guest.company || guest.name || 'Courier'}`;
    }
    if (guest.status === 'departed') {
      return 'Left premises';
    }
    if (guest.status === 'arrived') {
      return `Entry granted • Code ${guest.accessCode || '****'}`;
    }
    return `Expected • Code ${guest.accessCode || '****'}`;
  };

  if (loading && activities.length === 0) {
    // Small loading indicator or skeleton could go here
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Activity</Text>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (activities.length === 0) {
    // Optional: Don't show section if empty, or show "No recent activity"
    // For now, let's show empty state
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Activity</Text>
        <Text style={styles.emptyText}>No recent activity recorded.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>

      <View style={styles.list}>
        {activities.map((item, index) => {
          const isLast = index === activities.length - 1;
          const timeAgo = formatDistanceToNow(parseISO(item.updatedAt), {
            addSuffix: true,
          });

          return (
            <View key={item.id} style={styles.itemContainer}>
              {/* Timeline Line */}
              {!isLast && <View style={styles.timelineLine} />}

              {/* Icon Bubble */}
              <View style={styles.iconBubble}>{renderIcon(item)}</View>

              {/* Content */}
              <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.itemTitle}>{getTitle(item)}</Text>
                  <Text style={styles.itemSubtitle}>{getSubtitle(item)}</Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {timeAgo.replace('about ', '')}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20, // Increased from 10
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginBottom: 24, // Increased spacing
  },
  list: {
    //
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 28, // Spacing between items
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 28, // Center of the 56px bubble
    top: 56, // Start after the bubble
    bottom: -28, // Extend to next item
    width: 2,
    backgroundColor: '#F0F0F0',
    zIndex: -1,
  },
  iconBubble: {
    width: 56, // Increased size
    height: 56, // Increased size
    borderRadius: 28,
    backgroundColor: colors.whiteBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    marginRight: 16,
    // Shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4, // Align text with icon visually
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 17, // Increased size
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 16, // Increased size
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  timeContainer: {
    backgroundColor: '#EFF6FF', // Light blue bg for time pill
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontSize: 13, // Increased size
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    fontStyle: 'italic',
  },
});

export default RecentActivity;
