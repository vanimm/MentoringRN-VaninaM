import React, {useEffect} from 'react';
import { View, FlatList, KeyboardAvoidingView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import Comment from '../../components/comment';
import Post from '../../components/post';
import firebase from '../../services/firebase';

export default function TweetDetail({ route }) {

  const [comments, setComments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [post, setPost] = React.useState(null);

  useEffect(() => {
    const getPost = async () => {
      const post = await firebase.getPost(route.params.id);
      setPost(post);
      setComments(post.comments);
      setLoading(false);
    }
    getPost();
  }, []);

  
  const renderHeader = () => {
    return <Post {...post} />;
  };

  const renderComment = item => {
    return <Comment {...item} />;
  };

  if (loading && !post) {
    return null;
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
      <FlatList
        style={{flex: 1}}
        data={comments}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => renderComment(item)}
        ListHeaderComponent={renderHeader}
      />

      <View
        style={{
          height: 50,
          backgroundColor: '#FFF',
          color: 'red',
          borderTopWidth: 1,
          borderColor: '#DDD',
        }}>
        <TextInput
          style={{height: 50, padding: 10, textDecorationColor: 'red'}}
          placeholderTextColor="#BBB"
          placeholder="Write a comment..."
        />
      </View>
    </KeyboardAvoidingView>
  );
}