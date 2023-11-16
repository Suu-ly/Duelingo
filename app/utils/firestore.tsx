import firestore, {firebase} from '@react-native-firebase/firestore';
import TopicColors from '../common/constants/TopicColors';

//get data in the form desired for sectionlist
export const getSectionListData = async (language: string) => {
  try {
    // create an array for the sections
    const moduleArray: {
      id: number;
      title: any;
      data: string[];
      backgroundColor: string;
    }[] = [];
    //querySnapshot to get to the collection "Modules" for the chosen language
    const querySnapshot = await firestore()
      .collection('Quiz')
      .doc(language)
      .collection('Modules')
      .get();

    for (const documentSnapshot of querySnapshot.docs) {
      // create topicArray for the array of topic names for the data array in the moduleArray
      const topicArray = new Array<string>();
      // get the moduleNo from the respective module document
      const moduleIndex = documentSnapshot.data().moduleNo;
      //querySnapshot to get to the collections "Topics" for the chosen module and chosen language
      //documentSnapshot.id refers to the document name e.g. "Module1", "Module2" in the "Modules" collection
      const topicQuerySnapshot = await firestore()
        .collection('Quiz')
        .doc(language)
        .collection('Modules')
        .doc(documentSnapshot.id)
        .collection('Topics')
        .get();

      // for every topic doccument in the collection "Topics"
      for (const topicDocumentSnapshot of topicQuerySnapshot.docs) {
        // push the topic name into the topicArray
        topicArray.push(topicDocumentSnapshot.data().topicName);
      }

      moduleArray.push({
        id: moduleIndex - 1,
        // get the moduleName from the respective module document
        title: documentSnapshot.data().moduleName,
        data: topicArray,
        // if language is chinese, the colors start from the front. If the language is malay, the colors start from the back.
        backgroundColor:
          Object.values(TopicColors)[
            language === 'Chinese'
              ? moduleIndex - 1
              : Object.keys(TopicColors).length - moduleIndex
          ],
      });
    }
    return moduleArray;
  } catch (error) {
    console.error('Error getting data to Firestore:', error);
  }
};

export const numberOfCompletedModules = async (
  userUID: string,
  langauge: string,
) => {
  try {
    const documentSnapshot = await firestore()
      .collection('Users')
      .doc(userUID)
      .get();

    if (documentSnapshot.exists) {
      return (documentSnapshot.data() as any)[langauge];
    } else {
      return 6;
    }
  } catch (error) {
    console.error('Error getting user data to Firestore:', error);
  }
};

export const updatedNumberOfCompletedModules = async (
  userID: string,
  language: string,
) => {
  try {
    firestore()
      .collection('Users')
      .doc(userID)
      .update({[language]: firebase.firestore.FieldValue.increment(1)})
      .then(() => {
        console.log(userID);
        console.log('number of completed ' + language + ' modules updated!');
      });
  } catch (error) {
    console.error(
      'Error updating number of completed Modules to Firestore:',
      error,
    );
  }
};

// export const getLives = async (userID: string) => {
//   try {
//     const documentSnapshot = await firestore()
//       .collection('Users')
//       .doc(userID)
//       .get();

//     var lives = 0;
//     if (documentSnapshot.exists) {
//       lives = (documentSnapshot.data()?.hearts || {}).amount || 0;
//     }
//     console.log('getLives: ' + lives);
//     // await firestore()
//     //   .collection('Users')
//     //   .doc(userID)
//     //   .onSnapshot(doc => {
//     //     if (doc.exists) {
//     //       const lives = doc.data()?.hearts?.amount || 0;
//     //       console.log('firestore getting lives: ' + lives);
//     //     }
//     //   });
//     console.log('firestore FINISH getting lives: ' + lives);
//     return lives;
//   } catch (error) {
//     console.error('Error getting lives data from Firestore:', error);
//   }
// };

export const getLives = (userID: string, callback: (lives: number) => void) => {
  const userRef = firestore().collection('Users').doc(userID);

  // Set up a real-time listener
  const unsubscribe = userRef.onSnapshot(documentSnapshot => {
    var lives = 0;
    if (documentSnapshot.exists) {
      lives = (documentSnapshot.data()?.hearts || {}).amount || 0;
    }

    // Call the callback function with the updated lives value
    callback(lives);
  });

  // Return the unsubscribe function to stop the listener when needed
  return unsubscribe;
};

export const decreaseLives = async (userID: string, hearts: number) => {
  try {
    if (hearts === 5) {
      await firestore()
        .collection('Users')
        .doc(userID)
        .update({
          'hearts.amount': firebase.firestore.FieldValue.increment(-1),
          'hearts.timestamp': Date.now(),
        });
    } else {
      await firestore()
        .collection('Users')
        .doc(userID)
        .update({'hearts.amount': firebase.firestore.FieldValue.increment(-1)});
    }
  } catch (error) {
    console.error('Error updating lives: ', error);
  }
};

// export const resetTimestamp = async (userID: string) => {
//   const currentTime = Date.now();
//   const userDoc = await firestore().collection('Users').doc(userID).get();
//   if (userDoc.exists) {
//     await firestore()
//       .collection('Users')
//       .doc(userID)
//       .update({'hearts.timestamp': currentTime});
//   }
// };

// export const resetLives = async (userID: string) => {
//   const currentTime = firebase.firestore.Timestamp.now();
//   const userDoc = await firestore().collection('Users').doc(userID).get();

//   if (userDoc.exists) {
//     const userData = userDoc.data()!;
//     if (userData.hearts) {
//       const timestamp = userData.hearts.timestamp;
//       const differenceInSeconds = Math.floor(
//         (currentTime.toDate().getTime() - timestamp.toDate().getTime()) / 1000,
//       );
//       // const oneHourInSeconds = 3600;
//       const oneHourInSeconds = 60;

//       console.log(
//         'Checking whether current time is 1 hour more than timestamp',
//       );
//       if (differenceInSeconds >= oneHourInSeconds) {
//         await firestore().collection('Users').doc(userID).update({
//           'hearts.timestamp': currentTime,
//           'hearts.amount': 2,
//         });
//         console.log('reset Lives!');
//       }
//     }
//   }
// };

export const checkTimestamp = async (userID: string) => {
  const currentTime = Date.now();
  const userDoc = await firestore().collection('Users').doc(userID).get();
  let isPassedTimestamp = false;
  let timeLeft = 0;
  let userData = userDoc.data();

  if (userData) {
    if (userData.hearts) {
      const timestamp = userData.hearts.timestamp;
      const differenceInSeconds = Math.floor((currentTime - timestamp) / 1000);
      //currently putting the reset time interval to be 2 minute
      const twoMinutesInSeconds = 120;
      timeLeft = twoMinutesInSeconds - differenceInSeconds;
      //check if difference between current time and timestamp is more than reset time interval
      isPassedTimestamp = differenceInSeconds >= twoMinutesInSeconds;
    }
  }
  return {isPassedTimestamp, timeLeft};
};

//increase lives based on when user last heart refill
export const increaseLives = async (userID: string) => {
  const currentTime = Date.now();
  const userDoc = await firestore().collection('Users').doc(userID).get();

  if (userDoc.exists) {
    const userData = userDoc.data()!;
    if (userData.hearts) {
      const timestamp = userData.hearts.timestamp;
      const lives = userData.hearts.amount;
      const differenceInSeconds = Math.floor((currentTime - timestamp) / 1000);
      const twoMinutesInSeconds = 120;
      const heartsToRefill = Math.floor(
        differenceInSeconds / twoMinutesInSeconds,
      );
      await firestore()
        .collection('Users')
        .doc(userID)
        .update({
          'hearts.timestamp': currentTime,
          //if lives + heartsToRefill is more or equal to five, lives should increased to 5.
          'hearts.amount': firebase.firestore.FieldValue.increment(
            lives + heartsToRefill >= 5 ? 5 - lives : heartsToRefill,
          ),
        });
    }
  }
};
