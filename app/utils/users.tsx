import firestore from '@react-native-firebase/firestore';

export const createUser = (email: any, username: any, displayName: any) => {
  return firestore()
    .collection('Users')
    .add({
      displayName: displayName,
      username: username,
      email: email,
      exp: 0,
      friends: [{username: '', exp: 0}],
      hearts: 5,
      modules: {
        easy: 9,
        intermediate: 9,
        hard: 9,
      },
    })
    .then(() => {
      console.log('User created.');
    });
};

export const getUserID = () => {
  return firestore()
    .collection('Users')
    .get()
    .then(collectionSnapshot => {
      collectionSnapshot.forEach(documentSnapshot => {
        console.log('User ID: ', documentSnapshot.id);
      });
    });
};

export const UpdateUsername = (userAccount: any, username: any) => {
  return firestore()
    .collection('Users')
    .doc(userAccount)
    .update({
      name: username,
    })
    .then(() => {
      console.log('User updated!');
    });
};

export const AddFriend = (userAccount: any, username: any, exp: any) => {
  return firestore()
    .collection('Users')
    .doc(userAccount)
    .update({
      friends: [{name: username, exp: exp}],
    })
    .then(() => {
      console.log('User updated!');
    });
};

export const UpdateHearts = (userAccount: any, hearts: any) => {
  return firestore()
    .collection('Users')
    .doc(userAccount)
    .update({
      hearts: hearts,
    })
    .then(() => {
      console.log('User updated!');
    });
};

export const UpdateModules = (
  userAccount: any,
  easy: any,
  medium: any,
  hard: any,
) => {
  return firestore()
    .collection('Users')
    .doc(userAccount)
    .update({
      modules: {easy: easy, medium: medium, hard: hard},
    })
    .then(() => {
      console.log('User updated!');
    });
};

export const UpdateExp = (userAccount: any, exp: any) => {
  return firestore()
    .collection('Users')
    .doc(userAccount)
    .update({
      exp: exp,
    })
    .then(() => {
      console.log('User updated!');
    });
};

export const DeleteAccount = (userAccount: any) => {
  return firestore()
    .collection('Users')
    .doc(userAccount)
    .delete()
    .then(() => {
      console.log('User deleted!');
    });
};
