import {useNavigation} from '@react-navigation/native';
import {HStack, Icon, VStack, Text, Avatar, Divider} from 'native-base';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Feather from 'react-native-vector-icons/Feather';
import {Alert} from 'react-native';

export default function Drawer() {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Assuming user is logged in
    const userId = auth().currentUser.uid;

    const reference = database().ref(`/online/${userId}`);

    // Set the /users/:userId value to true
    reference
      .set(true)
      .then(() => console.log('Online presence set'))
      .catch(error => {
        Alert.alert(error.message);
      });

    // Remove the node whenever the client disconnects
    reference
      .onDisconnect()
      .remove()
      .then(() => console.log('On disconnect function configured.'));

    database()
      .ref('/online')
      .on('value', snapshot => {
        const data = snapshot.val();
        getOnlineUsers(data);
      });
  }, []);

  const navigation = useNavigation();
  const menuItems = [
    {
      name: 'Home',
      icon: 'home',
      route: 'Home',
    },
    {
      name: 'Profile',
      icon: 'person',
      route: 'Profile',
    },
    {
      name: 'Settings',
      icon: 'settings',
      route: 'Settings',
    },
    {
      name: 'Support Center',
      icon: 'help',
      route: 'Support Center',
    },
  ];

  const logout = () => {
    auth()
      .signOut()
      .then(() => {
        return null;
      });
  };

  const MenuItem = props => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate(props.route)}>
        <HStack alignItems={'center'}>
          <Icon
            name={props.icon}
            as={MaterialIcons}
            size={'md'}
            mr={2}
            color={'indigo.700'}></Icon>
          <Text fontSize={'16'}>{props.name}</Text>
        </HStack>
      </TouchableOpacity>
    );
  };

  const FriendItem = props => {
    return (
      <HStack alignItems={'center'} justifyContent={'space-between'}>
        <HStack>
          <Avatar size={'sm'} source={{uri: props.avatar}} mr={3} />
          <Text fontSize={16} mr={3}>{`${props.name} ${props.lastName}`}</Text>

          <Feather
            name="message-circle"
            size={20}
            style={{marginLeft: 2}}
            color={'green'}
          />
        </HStack>
      </HStack>
    );
  };

  const getOnlineUsers = online => {
    const userId = auth().currentUser.uid;
    setOnlineUsers([]);

    database()
      .ref('/users')
      .on('value', snapshot => {
        snapshot.forEach(childSnapshot => {
          if (online[childSnapshot.key] && childSnapshot.key !== userId) {
            setOnlineUsers(prev => [...prev, childSnapshot.val()]);
          }
        });
      });
  };

  return (
    <VStack safeArea space={3} px={5} py={4}>
      {menuItems.map(item => (
        <MenuItem name={item.name} icon={item.icon} route={item.route} />
      ))}

      <Divider bg="indigo.700" thickness="2" mr="2" mt="2" />
      {onlineUsers.map(user => (
        <FriendItem name={user.name} lastName={user.lastName} />
      ))}
      <TouchableOpacity onPress={logout}>
        <HStack alignItems={'center'}>
          <Icon
            name={'logout'}
            as={MaterialIcons}
            size={'md'}
            mr={2}
            color={'indigo.700'}
          />
          <Text fontSize={16}>Logout</Text>
        </HStack>
      </TouchableOpacity>
    </VStack>
  );
}
