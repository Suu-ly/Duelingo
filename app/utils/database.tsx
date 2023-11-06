import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
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
      uid: uid,
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
      avatar: Math.floor(Math.random() * 15),
    });
  console.log('User created.');
};

export const createFriend = (friendId: string) => {
  const user = auth().currentUser;
  if (user) {
    const uid = user.uid;
    // Add friend into own list
    firestore()
      .collection('Users')
      .doc(uid)
      .collection('Friends')
      .doc(friendId)
      .set({});
    // Add ownself into friend's list
    firestore()
      .collection('Users')
      .doc(friendId)
      .collection('Friends')
      .doc(uid)
      .set({});
  }
};

export const deleteFriend = (friendId: string) => {
  const user = auth().currentUser;
  if (user) {
    const uid = user.uid;
    // Delete from own list
    firestore()
      .collection('Users')
      .doc(uid)
      .collection('Friends')
      .doc(friendId)
      .delete();
    // Delete from friend's list
    firestore()
      .collection('Users')
      .doc(friendId)
      .collection('Friends')
      .doc(uid)
      .delete();
  }
};

export const getFriendList = async (userId?: string) => {
  const user = auth().currentUser;
  let friendList: string[] = [];
  // Other users' friend list, if userId is passed in as a parameter
  if (typeof userId !== 'undefined') {
    await firestore()
      .collection('Users')
      .doc(userId)
      .collection('Friends')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          friendList = [...friendList, documentSnapshot.id];
        });
      });
    // Own friend list, if no parameter is passed in
  } else if (user) {
    await firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('Friends')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          friendList = [...friendList, documentSnapshot.id];
        });
      });
  }
  return friendList;
};

export const getFriendData = async () => {
  const friendList = await getFriendList();
  let friendData: FirebaseFirestoreTypes.DocumentData[] = [];
  await firestore()
    .collection('Users')
    .orderBy('exp', 'desc')
    .where('uid', 'in', friendList)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        friendData.push(documentSnapshot.data());
      });
    });
  return friendData;
};

export const getUsersData = async (userIds?: string[]) => {
  const user = auth().currentUser;
  let data: FirebaseFirestoreTypes.DocumentData[] = [];
  // Users data corresponding to userIds passed in as a parameter
  if (typeof userIds !== 'undefined') {
    await firestore()
      .collection('Users')
      .where('uid', 'in', userIds)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          data.push(documentSnapshot.data());
        });
      });
    // All users data except own
  } else if (user) {
    const uid = user.uid;
    await firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          documentSnapshot.id != uid ? data.push(documentSnapshot.data()) : {};
        });
      });
  }
  return data;
};
