import React, { useState } from 'react';
import { View, Text, SafeAreaView, Keyboard, Alert } from 'react-native';
import Colors from '@/constants/Colors'; // Updated to Colors
import Button from '@/components/Button';
import Input from '@/components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '@/components/Loader';



interface LoginScreenProps {
  router: any; // Or a more generic navigation type
}

interface Inputs {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}
const LoginScreen: React.FC<LoginScreenProps> = ({ router  }) => {
  const [inputs, setInputs] = useState<Inputs>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);


  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    }
    if (isValid) {
      login();
    }
  };

  const login = async () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      try {
        let userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (
            inputs.email === parsedUserData.email &&
            inputs.password === parsedUserData.password
          ) {
            router.back();
            await AsyncStorage.setItem(
              'userData',
              JSON.stringify({ ...parsedUserData, loggedIn: true }),
            );
          } else {
            Alert.alert('Error', 'Invalid Details');
          }
        } else {
          Alert.alert('Error', 'User does not exist');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred');
      }
    }, 3000);
  };
  

  const handleOnchange = (text: string, input: keyof Inputs) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const handleError = (error: string | null, input: keyof Errors) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };
  return (<>
      <Loader visible={loading} /> 
      <Text style={{color: Colors.black, fontSize: 40, fontWeight: 'bold'}}>
        Login
      </Text>
      <Text style={{color: Colors.grey, fontSize: 18, marginVertical: 10}}>
        Enter Your Details to Login
      </Text>
      <View>
        
        
        <View style={{marginVertical: 20}}>
          <Input
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="email-outline"
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}
          />
          <Input
            onChangeText={text => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            iconName="lock-outline"
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            password
          />
          <Button title="Log In" onPress={validate} />
          <Text
            onPress={() => router.replace('/(modals)/signup')}
            style={{
              color: Colors.grey,
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
              marginTop:10
            }}>
            Don't have account? Register
          </Text>
        </View>
      </View></>
  );
};

export default LoginScreen;