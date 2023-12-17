import React from 'react';
import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import { defaultStyles } from '@/constants/Styles';


interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
}

const Button: React.FC<ButtonProps> = ({ title, onPress = () => {} }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={defaultStyles.btn}>
      <Text style={defaultStyles.btnText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
