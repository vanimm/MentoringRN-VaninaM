import React from 'react';
import {VStack, Box, Text, Input, Button} from 'native-base';
import auth from '@react-native-firebase/auth';
import styles from '../Login/styles';

export default function Login({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(null);

  /**
   * Go to signup screen
   */
  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  /**
   * Handle login
   */
  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          setErrorMessage('That email address is invalid!');
        }
        if (error.code === 'auth/user-not-found') {
          setErrorMessage('User not found');
        }
        if (error.code === 'auth/wrong-password') {
          setErrorMessage('Wrong password');
        }
      });
  };

  return (
    <Box
      justifyContent={'space-between'}
      bgColor={'indigo.500'}
      flex={1}
      safeAreaTop>
      <VStack p={15} space={5}>
        <Text
          textAlign={'center'}
          fontSize={30}
          color={'gray.200'}
          fontWeight="600">
          Login
        </Text>
        {errorMessage && (
          <Text  color={'red.300'} fontSize={15} textAlign={'center'}>
            {errorMessage}
          </Text>
        )}
        <Box>
          <Text fontSize={15} color={'white'}>
            Email
          </Text>
          <Input
            variant="outlined"
            placeholder="Email"
            bgColor={'white'}
            keyboardType={'email-address'}
            textContentType={'emailAddress'}
            onChangeText={text => setEmail(text)}></Input>
        </Box>
        <Box>
          <Text fontSize={15} color={'white'}>
            Password
          </Text>
          <Input
            variant="outlined"
            placeholder="Password"
            bgColor={'white'}
            type={'password'}
            onChangeText={text => setPassword(text)}></Input>
        </Box>
        <Button bgColor={'indigo.700'} disabled={!email && !password} onPress={handleLogin}>
          <Text color={'white'} fontWeight={'bold'} fontSize={15}>
            Log In
          </Text>
        </Button>
        <Button size="sm" variant="link" onPress={goToSignup}>
          <Text color={'indigo.200'} fontWeight={'bold'}>
            Create account
          </Text>
        </Button>
      </VStack>
    </Box>
  );
}
