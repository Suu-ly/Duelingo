import firestore, {firebase} from '@react-native-firebase/firestore';
import TopicColors from '../common/constants/TopicColors';

// To get all modulesNames from selected language
export const getModules = async (language: string) => {
  await firestore()
    .collection('Quiz')
    .doc(language)
    .collection('Modules')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        console.log(documentSnapshot.data().moduleName);
      });
    });
};

//To get all topics from selected module and language
export const getTopics = async (language: string, module: string) => {
  await firestore()
    .collection('Quiz')
    .doc(language)
    .collection('Modules')
    .doc(module)
    .collection('Topics')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        console.log(documentSnapshot.data().topicName);
      });
    });
};

// To get selected question of selected topic, module and language
export const getQuestions = (
  language: string,
  module: string,
  topic: string,
  questionNo: number,
) => {
  firestore()
    .collection('Quiz')
    .doc(language)
    .collection('Modules')
    .doc(module)
    .collection('Topics')
    .doc(topic)
    .collection('Questions')
    .doc('Question' + questionNo)
    .get()
    .then(documentSnapshot => {
      documentSnapshot.data();
    });
};

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
