import { View, Text } from 'react-native';

const ModalHeaderText = () => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
        <Text
          style={{
            fontFamily: 'mon-sb',
            fontSize: 18,
            color: '#000',
          }}>
          Find your place
        </Text>
    </View>
  );
};

export default ModalHeaderText;
