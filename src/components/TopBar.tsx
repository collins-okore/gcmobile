import React from 'react';
import {StatusBar} from 'react-native';
import TransparentBar from './TopBar/TransparentBar';
import SearchBar from './TopBar/SearchBar';
import SearchTitleBar from './TopBar/SearchTitleBar';
import DefaultBar from './TopBar/DefaultBar';
import colors from '../themes/colors';

interface TopBarProps {
  title?: string;
  titleColor?: string;
  subTitle?: string;
  right?: any[];
  style?: any;
  dark?: boolean;
  transparent?: boolean;
  transparentStatus?: boolean;
  searchTitleBar?: boolean;
  statusBarHeight?: number;
  back?: boolean;
  cancel?: boolean;
  search?: boolean;
  searchPlaceholder?: string;
  elevation?: number;
  onPressSearchBar?: () => void;
  left?: any;
  onBackPress?: () => void;
  navigation?: any;
  gradient?: any;
  popup?: any[];
  rightDisabled?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  title = '',
  titleColor = colors.darkFont,
  subTitle = '',
  right = [],
  style = {},
  dark = false,
  transparent = false,
  transparentStatus = true,
  searchTitleBar = false,
  statusBarHeight = StatusBar.currentHeight,
  back = true,
  cancel = false,
  search = false,
  searchPlaceholder = 'Search',
  elevation = 1,
  onPressSearchBar = () => {},
  popup,
  rightDisabled = false,
  onBackPress,
  navigation,
  gradient,
  ...props
}) => {
  /*
   * When navbar is transparent, Content is drawn Under
   * Default Linear Gradient flows Vertically
   */
  const handleBackPress = () => {
    if (onBackPress) {
      return onBackPress();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const commonProps = {
    title,
    titleColor,
    subTitle,
    right,
    style,
    dark,
    transparent,
    transparentStatus,
    searchTitleBar,
    statusBarHeight,
    back,
    cancel,
    search,
    searchPlaceholder,
    elevation,
    onPressSearchBar,
    left: props.left,
    onBackPress: handleBackPress,
    gradient,
    popup,
    rightDisabled,
    ...props,
  };

  // Switch navbar depending on state of the screen
  if (search) {
    return <SearchBar {...commonProps} />;
  } else if (transparent) {
    return <TransparentBar {...commonProps} />;
  } else if (searchTitleBar) {
    return <SearchTitleBar {...commonProps} />;
  } else {
    return <DefaultBar {...commonProps} />;
  }
};

export default TopBar;
