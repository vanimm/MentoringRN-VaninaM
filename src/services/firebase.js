import database from '@react-native-firebase/database';

export default class FirebaseDatabaseTypes {
  static getPosts() {
    return database()
      .ref('posts')
      .once('value')
      .then(snapshot => {
        const posts = [];
        snapshot.forEach(childSnapshot => {
          posts.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        return posts;
      });
  }

  static getPost(postId) {
    return database()
      .ref(`posts/${postId}`)
      .once('value')
      .then(snapshot => {
        return {
          id: snapshot.key,
          ...snapshot.val(),
        };
      });
  }

  static createPost(text) {
    const content = {
      text,
      image: 'https://picsum.photos/200/300',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      user: {
        id: 7,
        name: 'Vanina Morínigo',
        username: '@vanimorinigo',
        avatar: 'https://api.lorem.space/image/face?w=150&h=150',
      },
      comments: [],
    };

    return database()
      .ref('posts')
      .push(content)
      .then(() => {
        console.log('Post created!');
        return content;
      });
  }

  static updatePost(postId, content) {
    return database()
      .ref(`posts/${postId}`)
      .set(content)
      .then(() => {
        console.log('Post update!');
        return content;
      });
  }

//   static removePost(postId)  {
//     return  database()
//       .ref(`posts/${postId}`).remove()
//       .then(() => {
//         console.log('Post remove!');
//       });
//   }
}
