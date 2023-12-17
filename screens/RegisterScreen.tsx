import React, { useState } from 'react';
import { useSignUp } from "@clerk/clerk-expo";
import { View, Text, Keyboard, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';

import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader';


interface RegistrationScreenProps {
  router: any;
}

interface Inputs {
  email: string;
  fullname: string;
  phone: string;
  password: string;
}

interface Errors {
  email?: string;
  fullname?: string;
  phone?: string;
  password?: string;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ router }) => {
  const [inputs, setInputs] = useState<Inputs>({ email: '', fullname: '', phone: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { isLoaded, signUp, setActive } = useSignUp();
 
  
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

   // start the sign up process.
   const register = async () => {
    if (!isLoaded) {
      return;
    }
    const { email, fullname, password } = inputs;
    
    const [firstName, lastName] = fullname.split(' '); // Splitting fullname into first and last name

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        
      });
 
      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
 
      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      if (err.code === 'form_password_pwned') {
        Alert.alert('Password Issue', 'Please use a different, more secure password.');
      } else {
        console.error(JSON.stringify(err, null, 2));
      }
    }
  };
  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
 
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
 
      await setActive({ session: completeSignUp.createdSessionId });
      router.back();
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }

    if (!inputs.fullname) {
      handleError('Please input fullname', 'fullname');
      isValid = false;
    }

    if (!inputs.phone) {
      handleError('Please input phone number', 'phone');
      isValid = false;
    }

    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    } else if (inputs.password.length < 5) {
      handleError('Min password length of 5', 'password');
      isValid = false;
    }

    if (isValid) {
      register();
    }
  };


  const handleOnchange = (text: string, input: keyof Inputs) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const handleError = (error: string | null, input: keyof Errors) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };
  return (
    <>     
        <Loader visible={loading} />
        {!pendingVerification && (<>
        <Text style={{color: Colors.black, fontSize: 40, fontWeight: 'bold'}}>
          Register
        </Text>
        <Text style={{color: Colors.grey, fontSize: 18, marginVertical: 10}}>
          Enter Your Details to Register
        </Text>
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
            onChangeText={text => handleOnchange(text, 'fullname')}
            onFocus={() => handleError(null, 'fullname')}
            iconName="account-outline"
            label="Full Name"
            placeholder="Enter your full name"
            error={errors.fullname}
          />

          <Input
            keyboardType="numeric"
            onChangeText={text => handleOnchange(text, 'phone')}
            onFocus={() => handleError(null, 'phone')}
            iconName="phone-outline"
            label="Phone Number"
            placeholder="Enter your phone no"
            error={errors.phone}
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
          <Button title="Register" onPress={validate} />
          <Text
            onPress={() => router.replace('/(modals)/login')}
            style={{
              color: Colors.grey,
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
              marginTop: 10
            }}>
            Already have account? Login
          </Text>
        </View></>)}
        {pendingVerification && (<>
          <Input
            keyboardType="numeric"
            onChangeText={(code) => setCode(code)}
            iconName="lock-outline"
            label="Verification code"
            placeholder="Enter the code"
          />
          <Button title="Verify email" onPress={onPressVerify} />
        </>
      )}
    </> 
  );
};

export default RegistrationScreen;