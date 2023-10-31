import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Get All Quizzes
export const getAllQuiz = () => {
  return firestore().collection('Quizzes').get();
};

// Get Quiz With Specific Language
export const getQuiz = (language: any) => {
  return firestore().collection('Quizzes').doc(language).get();
};

export const createUser = (
  email: any,
  username: any,
  displayName: any,
  uid: any,
) => {
  firestore()
    .collection('Users')
    .doc(uid)
    .set({
      displayName: displayName,
      username: username,
      email: email,
      exp: 0,
      hearts: {
        amount: 5,
        timestamp: 0,
      },
      chinese: 0,
      malay: 0,
      avatar: 0,
    });
  console.log('User created.');

  // Cannot create empty collection, a document must be added
  firestore().collection('Users').doc(uid).collection('Friends').add({});
};

export const createFriend = async (username: any) => {
  const user = auth().currentUser;
  if (user) {
    const uid = user.uid;
    await firestore()
      .collection('Users')
      .where('username', '==', username)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          console.log(documentSnapshot.id);
          firestore()
            .collection('Users')
            .doc(uid)
            .collection('Friends')
            .doc(documentSnapshot.id)
            .set({});
        });
      });
  }
};

export const getFriendList: any = async () => {
  const user = auth().currentUser;
  var friendList: string[] = [];
  if (user) {
    const uid = user.uid;
    await firestore()
      .collection('Users')
      .doc(uid)
      .collection('Friends')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          friendList = [...friendList, documentSnapshot.id];
        });
        // remove first document added during account creation ()
        friendList.shift();
      });
  }
  return friendList;
};
