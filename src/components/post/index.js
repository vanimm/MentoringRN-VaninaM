import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, Image, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {HStack, Avatar, Box} from 'native-base';
import firebase from '../../services/firebase';

export default function Post(post) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('TweetDetail', {id: post.id});
  };

  const getRamdomBoolean = () => {
    return Math.random() >= 0.5;
  };

  const removePost = async id => {
    try {
      await firebase.removePost(id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => handlePress()}
      style={{
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
      }}>
      <Avatar source={{uri: post.user.avatar}} height={60} width={60} />
      <Box width={290} mx={3}>
        <HStack>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {post.user.name}
          </Text>
          {post.user.id && (
            <MaterialIcons
              name="verified"
              size={16}
              color="blue"
              style={{marginLeft: 3}}
            />
          )}
          <Text style={{fontSize: 16, color: 'gray', marginLeft: 3}}>
            {post.user.username}
          </Text>
          <TouchableOpacity onPress={() => removePost()}>
            <EvilIcons
              name="trash"
              size={24}
              style={{marginLeft: 30}}
              color={'black'}
            />
          </TouchableOpacity>
        </HStack>
        <Text style={{fontSize: 14, marginBottom: 5}}>{post.text}</Text>
        <Image
          source={{uri: post.image}}
          style={{width: '100%', height: 150}}
        />
        <HStack justifyContent={'space-around'} mt={3}>
          <HStack>
            <EvilIcons
              name="retweet"
              size={24}
              style={{marginLeft: 3}}
              color={getRamdomBoolean() ? 'green' : null}
            />
            <Text style={{fontSize: 14, marginLeft: 3}}>
              {post.sharesCount}
            </Text>
          </HStack>
          <HStack>
            <EvilIcons
              name="comment"
              size={24}
              style={{marginLeft: 3}}
              color={getRamdomBoolean() ? 'green' : null}
            />
            <Text style={{fontSize: 14, marginLeft: 3}}>
              {post.commentsCount}
            </Text>
          </HStack>
          <HStack>
            <EvilIcons
              name="heart"
              size={24}
              style={{marginLeft: 3}}
              color={getRamdomBoolean() ? 'red' : null}
            />
            <Text style={{fontSize: 14, marginLeft: 3}}>{post.likesCount}</Text>
          </HStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}
