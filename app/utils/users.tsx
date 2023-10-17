import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection('Users');

export const users = () => {
  return firestore().collection('Users').get();
};

firestore()
  .collection('Users')
  .doc('vkOP5HVmFdF0Y0ByAoeF')
  .update({
    name: 'aussie',
  })
  .then(() => {
    console.log('User added!');
  });

// const usersCollection = firestore()
//     .collection('Users')
//     .get()
//     .then(collectionSnapshot => {
//         console.log('Total users: ', collectionSnapshot.size);
//         collectionSnapshot
//             .forEach(documentSnapshot => {
//                 console.log('User ID: ', documentSnapshot.id,
//                     documentSnapshot.data());
//             });
//     });

//     firestore()
//     .collection('Users')
//     .add({
//         name: 'austin123',
//         exp: '0',
//         hearts: '5',
//         modules: {easy: 9, medium: 9, hard: 9},
//         friends: [{name:"ap", exp:0}]

//     })
//     .then(() => {
//         console.log('User added!');
//     });

//     firestore()
//     .collection('Users')
//     .doc('vkOP5HVmFdF0Y0ByAoeF')
//     .update({
//         name: 'austin123',
//         exp: '0',
//         hearts: '5',
//         modules: {easy:0, medium:0, hard:0},
//         friends: [{name:"ap", exp:0}, {name: "ap2", exp:50}]
//     })
//     .then(() => {
//         console.log('User added!');
//     });

//     firestore()
//     .collection('Users')
//     .doc('vkOP5HVmFdF0Y0ByAoeF')
//     .delete()
//     .then(() => {
//         console.log('User deleted!');
//     });
