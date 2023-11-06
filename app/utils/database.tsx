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
      avatar: 0,
    });
  console.log('User created.');

  // Cannot create empty collection, a document must be added
  firestore().collection('Users').doc(uid).collection('Friends').add({});
};

export const createFriend = async (username: string) => {
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

export const getFriendList = async (userId?: string) => {
  const user = auth().currentUser;
  let friendList: string[] = [];
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
        // remove first document added during account creation ()
        friendList.shift();
      });
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
        // remove first document added during account creation ()
        friendList.shift();
      });
  }
  return friendList;
};

export const getFriendData = async () => {
  const user = auth().currentUser;
  let friendList: string[] = [];
  let friendData: FirebaseFirestoreTypes.DocumentData[] = [];
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
  }
  return friendData;
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

export const getUsersData = async (userIds: string[]) => {
  let data: FirebaseFirestoreTypes.DocumentData[] = [];
  await firestore()
    .collection('Users')
    .where('uid', 'in', userIds)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        data.push(documentSnapshot.data());
      });
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
