import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import Icon from '../Icon';

interface DropdownOption {
  label: string;
  value: string;
  onPress: () => void;
  icon?: string;
  textColor?: string;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  testID?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  options,
  testID,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const triggerRef = useRef<View>(null);

  const showDropdown = () => {
    if (triggerRef.current) {
      triggerRef.current.measure((x, y, width, height, pageX, pageY) => {
        setTriggerLayout({
          x: pageX,
          y: pageY,
          width,
          height,
        });
        setIsVisible(true);
      });
    }
  };

  const hideDropdown = () => {
    setIsVisible(false);
  };

  const handleOptionPress = (option: DropdownOption) => {
    hideDropdown();
    option.onPress();
  };

  const screenWidth = Dimensions.get('window').width;
  const dropdownWidth = 160;

  // Calculate dropdown position
  const dropdownLeft = Math.min(
    triggerLayout.x + triggerLayout.width - dropdownWidth,
    screenWidth - dropdownWidth - 16,
  );
  const dropdownTop = triggerLayout.y + triggerLayout.height + 8;

  return (
    <>
      <View ref={triggerRef} testID={testID}>
        <TouchableOpacity onPress={showDropdown} activeOpacity={0.7}>
          {trigger}
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={isVisible}
        animationType="fade"
        onRequestClose={hideDropdown}>
        <TouchableWithoutFeedback onPress={hideDropdown}>
          <View style={styles.overlay}>
            <View
              style={[
                styles.dropdown,
                {
                  left: dropdownLeft,
                  top: dropdownTop,
                  width: dropdownWidth,
                },
              ]}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    index === options.length - 1 && styles.lastOption,
                  ]}
                  onPress={() => handleOptionPress(option)}
                  activeOpacity={0.7}>
                  <View style={styles.optionContent}>
                    {option.icon && (
                      <Icon
                        name={option.icon}
                        size={16}
                        color={option.textColor || colors.darkFont}
                        style={styles.optionIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        {color: option.textColor || colors.darkFont},
                      ]}>
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: colors.whiteBg,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    fontFamily: fonts.regular,
    flex: 1,
  },
});

export default DropdownMenu;
