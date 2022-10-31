import React from 'react';
import {Input, Text, Box, VStack, Button, HStack, Icon} from 'native-base';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import {ActivityIndicator} from 'react-native';

export default function Signup({navigation}) {
  const [name, setName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const goToLoginScreen = () => {
    navigation.navigate('Login');
  };

  const handleSignup = () => {
    console.warn(email, password);
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then( (response)=>{
        return database().ref(`/users/${response.user.uid}`).set({
          name,
          lastName,
          email,
        });
      })
      .then(() => {
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          setErrorMessage('That email address is invalid!');
        }
      });
  };

  const verifyPassword = () => {
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    return password === confirmPassword;
  };

  return (
    <Box bgColor={'indigo.500'} justifyContent={'center'} flex={1} safeAreaTop>
      <Button variant={'ghost'} width={150} onPress={goToLoginScreen}>
        <HStack pl={2} alignContent={'center'}>
          <Icon
            as={Ionicons}
            name={'arrow-back-outline'}
            size={'md'}
            color={'white'}
            fontWeight={'bold'}
          />
          <Text color={'white'} fontWeight={'bold'}>
            Login
          </Text>
        </HStack>
      </Button>
      <Box flex={1}>
        <VStack p={10} space={4}>
          <Text
            textAlign={'center'}
            fontSize={26}
            color={'gray.200'}
            fontWeight={'600'}>
            Signup
          </Text>
          {errorMessage && (
            <Text color={'red.300'} fontSize={15} textAlign={'center'}>
              {errorMessage}
            </Text>
          )}
          <Box>
            <Text color={'white'}>Name</Text>
            <Input
              variant="outlined"
              placeholder="Name"
              bgColor={'white'}
              value={name}
              onChangeText={text => setName(text)}
            />
          </Box>
          <Box>
            <Text color={'white'}>Last Name</Text>
            <Input
              variant="outlined"
              placeholder="Last Name"
              bgColor={'white'}
              value={lastName}
              onChangeText={text => setLastName(text)}
            />
          </Box>
          <Box>
            <Text color={'white'}>Email</Text>
            <Input
              variant="outlined"
              placeholder="Email"
              bgColor={'white'}
              value={email}
              keyboardType={'email-address'}
              textContentType={'emailAddress'}
              onChangeText={text => setEmail(text)}
            />
          </Box>
          <Box>
            <Text color={'white'}>Password</Text>
            <Input
              variant="outlined"
              placeholder="Password"
              bgColor={'white'}
              value={password}
              onChangeText={text => setPassword(text)}
              onBlur={verifyPassword}
              type={'password'}
            />
          </Box>
          <Box>
            <Text color={'white'}>Repeat Password</Text>
            <Input
              variant="outlined"
              placeholder="Password"
              bgColor={'white'}
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              onBlur={verifyPassword}
              type={'password'}
            />
          </Box>
          <Button
            variant={'solid'}
            bgColor={'indigo.700'}
            mt={5}
            onPress={handleSignup}
            disabled={!verifyPassword || loading}>
            <HStack>
              {loading && <ActivityIndicator />}
              <Text color={'white'} fontWeight={'bold'}>
                Create account
              </Text>
            </HStack>
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
