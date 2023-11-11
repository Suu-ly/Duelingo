import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Get All Quizzes
export const getAllQuiz = () => {
  return firestore().collection('Quizzes').get();
};

// Get Quiz With Specific Language
export const getQuiz = (language: string) => {
  return firestore().collection('Quizzes').doc(language).get();
};

export const createUser = (
  email: string,
  username: string,
  displayName: string,
  uid: string,
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
  if (userId) {
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
  if (friendList.length > 0) {
    let friendData: FirebaseFirestoreTypes.DocumentData[] = [];
    while (friendList.length) {
      const batch = friendList.splice(0, 10);
      await firestore()
        .collection('Users')
        .where('uid', 'in', batch)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            friendData.push(documentSnapshot.data());
          });
        });
    }
    return friendData.sort((a, b) => b.exp - a.exp);
  }
  return [];
};

export const getUsersData = async (userIds?: string[]) => {
  const user = auth().currentUser;
  let data: FirebaseFirestoreTypes.DocumentData[] = [];
  // Users data corresponding to userIds passed in as a parameter
  if (userIds) {
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

export const getUserData = async (userId: string) => {
  let data: FirebaseFirestoreTypes.DocumentData = {};
  await firestore()
    .collection('Users')
    .doc(userId)
    .get()
    .then(documentSnapshot => {
      data = documentSnapshot.data()!;
    });
  return data;
};

export const getMultiplayerQuestions = async (
  language: string,
  difficulty: string,
  questions: Array<number>,
) => {
  let questionBank: FirebaseFirestoreTypes.DocumentData[] = [];
  await firestore()
    .collection('Quiz')
    .doc(language)
    .collection('Multiplayer')
    .doc(difficulty)
    .collection('questions')
    .where('questionNo', 'in', questions)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        questionBank.push(documentSnapshot.data());
      });
    });
  return questionBank;
};
