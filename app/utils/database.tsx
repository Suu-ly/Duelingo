import firestore, {
  FirebaseFirestoreTypes,
  firebase,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
        timestamp: Date.now(),
      },
      chinese: 0,
      malay: 0,
      avatar: Math.floor(Math.random() * 15),
    });
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

export const UpdateDisplayname = async (username: string) => {
  let uid = auth().currentUser?.uid;
  if (uid) {
    await firestore().collection('Users').doc(uid).update({
      displayName: username,
    });
  }
};

export const UpdateAvatar = async (avatar: number) => {
  let uid = auth().currentUser?.uid;
  if (uid) {
    await firestore().collection('Users').doc(uid).update({
      avatar: avatar,
    });
  }
};

export const UpdateUsername = async (username: string) => {
  let uid = auth().currentUser?.uid;
  if (uid) {
    await firestore().collection('Users').doc(uid).update({
      username: username,
    });
  }
};

export const checkUsernameExists = async (username: string) => {
  let result = false;
  await firestore()
    .collection('Users')
    .where('username', '==', username)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        result = false;
      } else {
        result = true;
      }
    });
  return result;
};

export const calculateMultiplayerExp = (difficulty: string, score: number) => {
  if (difficulty === 'easy') return Math.floor(0.6 * 0.05 * score);
  if (difficulty === 'intermediate') return Math.floor(0.6 * 0.1 * score);
  if (difficulty === 'hard') return Math.floor(0.6 * 0.15 * score);
  return 0;
};

export const updateExp = async (exp: number) => {
  let uid = auth().currentUser?.uid;
  if (uid) {
    firestore()
      .collection('Users')
      .doc(uid)
      .update({
        exp: firebase.firestore.FieldValue.increment(exp),
      });
  }
};

export const calculateSingleplayerExp = (
  module: number,
  topic: number,
  score: number,
) => {
  return Math.floor(100 * score + module * topic * 10);
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

export const getLeaderboardData = async () => {
  let leaderboardData: FirebaseFirestoreTypes.DocumentData[] = [];
  await firestore()
    .collection('Users')
    .orderBy('exp', 'desc')
    .limit(50)
    .get()
    .then(querySnapshot =>
      querySnapshot.forEach(documentSnapshot => {
        leaderboardData.push(documentSnapshot.data());
      }),
    );
  return leaderboardData;
};
