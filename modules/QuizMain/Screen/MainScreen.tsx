import React, {useState, useLayoutEffect, useEffect} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Slider} from 'react-native-elements/dist/slider/Slider';
import AccordianContent from '../Components/AccordianContent';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {ListItem} from 'react-native-elements';
import {useIsFocused} from '@react-navigation/native';
import {quizOptions} from '../../utils/QuizOptions';
import {
   HeaderColor,
   C56D8AE,
   SliderThumbColor,
   SliderTrackColor,
   BackgroundColor,
} from '../../utils/Styles';
import {MainStackScreenProps} from '../types/quizMainStackNavigationTypes';
import MainStackScreenHeader from '../Components/MainStackScreenHeader';
import {getParsingQuizOption} from '../../utils/utilFunction';
import {getQuizThunk, resetQuiz} from '../../utils/Redux/slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
   deleteQiuz,
   GET_WRONG_ANSWER_NOTE,
} from '../../utils/AsyncStorageHandlers';
import {WrongAnswerNoteType} from '../../utils/utilsTypes';
import WrongAnswerListItem from '../Components/WrongAnswerListItem';
import QuizOptionItem from '../Components/QuizOptionItem';

const MainScreen = ({navigation}: MainStackScreenProps) => {
   const [numberOfQuiz, setNumberOfQuiz] = useState(1);
   const [selectedCategory, setSelectedCategory] = useState('');
   const [difficulty, setDifficulty] = useState('');
   const [quizType, setQuizType] = useState('');

   const [isNumberOfQuizExtends, setIsNumberQuizExtends] = useState(false);
   const [isCategoryExtends, setIsCategoryExtends] = useState(false);
   const [isDifficultyExtends, setIsDifficultyExtends] = useState(false);
   const [isWrongAnswerExtends, setIsWrongAnswerExtends] = useState(false);
   const [isQuizTypeExtends, setIsQuizTypeExtends] = useState(false);

   const [wrongAnswerNote, setWrongAnswerNote] = useState<
      WrongAnswerNoteType[]
   >([]);

   const isFocus = useIsFocused();
   const dispatcher = useDispatch();
   const getQuiz = useSelector((state: any) => state.slice.shuffleQuiz);

   const categoryHandler = (category: string) => {
      setSelectedCategory(category);
      setIsCategoryExtends(false);
   };
   const difficultyHandler = (option: string) => {
      setDifficulty(option);
      setIsDifficultyExtends(false);
   };
   const quizTypeHandler = (option: string) => {
      setQuizType(option);
      setIsQuizTypeExtends(false);
   };
   const deleteWrongAnswerNoteHandler = (id: string) => {
      deleteQiuz(id).then(isDeleted => {
         if (isDeleted) {
            setWrongAnswerNote(prev => prev.filter(item => item.quizId !== id));
         }
      });
   };
   const goToWrongAnswerNoteHandler = (info: WrongAnswerNoteType) => {
      navigation.navigate('SolvingQuiz', {
         selectedOption: info.selectedOption,
         isWrongAnswerNotes: true,
         wrongAnswerNoteInfo: info,
      });
   };
   useLayoutEffect(() => {
      navigation.setOptions({
         header: () => (
            <MainStackScreenHeader
               title="?????? ?????????"
               navigation={navigation}
               difficulty={difficulty}
               numberOfQuiz={numberOfQuiz}
               quizType={quizType}
               category={selectedCategory}
            />
         ),
      });
   }, [difficulty, navigation, numberOfQuiz, quizType, selectedCategory]);
   useEffect(() => {
      // ???????????? ?????? ????????????
      if (selectedCategory && difficulty && quizType && numberOfQuiz) {
         const getParsing = getParsingQuizOption(
            selectedCategory,
            difficulty,
            quizType,
            numberOfQuiz,
         );
         dispatcher(getQuizThunk(getParsing));
         console.log('??????????????????');
      }
   }, [selectedCategory, difficulty, quizType, numberOfQuiz, dispatcher]);
   useEffect(() => {
      if (selectedCategory && difficulty && quizType && numberOfQuiz) {
         if (getQuiz.length <= 0) {
            Alert.alert('????????? ???????????? ?????????????????? ?????? ??????????????????!');
         }
         console.log('????????????');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [getQuiz]);
   useLayoutEffect(() => {
      if (isFocus) {
         // ????????? ????????? ???????????? ????????? ?????? ?????? ?????????
         setNumberOfQuiz(1);
         setSelectedCategory('');
         setDifficulty('');
         setQuizType('');
         dispatcher(resetQuiz());
         AsyncStorage.getItem(GET_WRONG_ANSWER_NOTE).then(data => {
            if (data) {
               const getItem: WrongAnswerNoteType[] = JSON.parse(data);
               setWrongAnswerNote(getItem);
            }
         });
         setIsNumberQuizExtends(false);
         setIsCategoryExtends(false);
         setIsDifficultyExtends(false);
         setIsQuizTypeExtends(false);
         setIsWrongAnswerExtends(false);
      }
   }, [dispatcher, isFocus]);
   console.log('??????????');
   return (
      <ScrollView bounces={false} style={styles.ScrollViewContainer}>
         <View style={styles.container}>
            <ListItem.Accordion
               testID="numberOfQuiz"
               hasTVPreferredFocus={undefined}
               tvParallaxProperties={undefined}
               containerStyle={styles.accordionContentStyle}
               content={
                  <AccordianContent
                     Icon={() => (
                        <Icon
                           type="feather"
                           name="plus-square"
                           color={HeaderColor}
                           size={30}
                        />
                     )}
                     title="??? ??????"
                     subTitle={`${numberOfQuiz * 10} ??????`}
                  />
               }
               isExpanded={isNumberOfQuizExtends}
               onPress={() => setIsNumberQuizExtends(!isNumberOfQuizExtends)}
            >
               <View style={styles.sliderContainer}>
                  <Slider
                     value={numberOfQuiz}
                     onValueChange={setNumberOfQuiz}
                     animationType="timing"
                     maximumValue={5}
                     minimumValue={1}
                     step={1}
                     trackStyle={styles.silderTrackStyle}
                     allowTouchTrack
                     thumbStyle={styles.thumbStyle}
                  />
               </View>
            </ListItem.Accordion>

            <ListItem.Accordion
               testID="quizDifficulty"
               hasTVPreferredFocus={undefined}
               tvParallaxProperties={undefined}
               containerStyle={styles.accordionContentStyle}
               content={
                  <AccordianContent
                     Icon={() => (
                        <Icon
                           type="entypo"
                           color={HeaderColor}
                           name="pencil"
                           size={30}
                        />
                     )}
                     subTitle={difficulty}
                     title="?????? ?????????"
                  />
               }
               isExpanded={isDifficultyExtends}
               onPress={() => {
                  setIsDifficultyExtends(!isDifficultyExtends);
               }}
            >
               {isDifficultyExtends &&
                  quizOptions.SelectDifficulty.map(option => (
                     <QuizOptionItem
                        key={option}
                        option={option}
                        optionHandler={difficultyHandler}
                     />
                  ))}
            </ListItem.Accordion>
            <ListItem.Accordion
               testID="quizType"
               hasTVPreferredFocus={undefined}
               tvParallaxProperties={undefined}
               containerStyle={styles.accordionContentStyle}
               content={
                  <AccordianContent
                     Icon={() => (
                        <Icon
                           type="antdesign"
                           color={HeaderColor}
                           name="checksquareo"
                           size={30}
                        />
                     )}
                     subTitle={quizType}
                     title="?????? ??????"
                  />
               }
               isExpanded={isQuizTypeExtends}
               onPress={() => {
                  setIsQuizTypeExtends(!isQuizTypeExtends);
               }}
            >
               {isQuizTypeExtends &&
                  quizOptions.SelectType.map(option => (
                     <QuizOptionItem
                        key={option}
                        option={option}
                        optionHandler={quizTypeHandler}
                     />
                  ))}
            </ListItem.Accordion>
            <ListItem.Accordion
               testID="quizCategory"
               hasTVPreferredFocus={undefined}
               tvParallaxProperties={undefined}
               containerStyle={styles.accordionContentStyle}
               content={
                  <AccordianContent
                     Icon={() => (
                        <Icon
                           type="material"
                           color={HeaderColor}
                           name="category"
                           size={30}
                        />
                     )}
                     subTitle={selectedCategory}
                     title="?????? ??????"
                  />
               }
               isExpanded={isCategoryExtends}
               onPress={() => {
                  setIsCategoryExtends(!isCategoryExtends);
               }}
            >
               {isCategoryExtends &&
                  quizOptions.SelectCategory.map(category => (
                     <QuizOptionItem
                        key={category}
                        option={category}
                        optionHandler={categoryHandler}
                     />
                  ))}
            </ListItem.Accordion>
            <ListItem.Accordion
               testID="wrongAnswerNote"
               hasTVPreferredFocus={undefined}
               tvParallaxProperties={undefined}
               containerStyle={styles.accordionContentStyle}
               content={
                  <AccordianContent
                     Icon={() => (
                        <Icon
                           type="entypo"
                           color={HeaderColor}
                           name="lab-flask"
                           size={30}
                        />
                     )}
                     subTitle={''}
                     title="????????????"
                  />
               }
               isExpanded={isWrongAnswerExtends}
               onPress={() => {
                  setIsWrongAnswerExtends(!isWrongAnswerExtends);
               }}
            >
               {isWrongAnswerExtends &&
                  wrongAnswerNote.map(wrongAnswerNoteItem => (
                     <WrongAnswerListItem
                        key={wrongAnswerNoteItem.quizId}
                        deleteWrongAnswerNoteHandler={
                           deleteWrongAnswerNoteHandler
                        }
                        goToWrongAnswerNoteHandler={goToWrongAnswerNoteHandler}
                        wrongAnswerNoteItem={wrongAnswerNoteItem}
                     />
                  ))}
            </ListItem.Accordion>
         </View>
      </ScrollView>
   );
};

export default MainScreen;

const styles = StyleSheet.create({
   ScrollViewContainer: {
      paddingHorizontal: 12,
      paddingTop: 10,
      backgroundColor: BackgroundColor,
   },
   container: {
      flex: 1,
   },
   accordionContentStyle: {
      paddingHorizontal: 4,
      borderBottomWidth: 1.3,
      borderBottomColor: C56D8AE,
   },
   sliderContainer: {
      paddingHorizontal: 20,
   },
   silderTrackStyle: {
      backgroundColor: SliderTrackColor,
      width: '100%',
      justifyContent: 'center',
      height: 5,
   },
   thumbStyle: {
      width: 30,
      height: 30,
      backgroundColor: SliderThumbColor,
   },
});
