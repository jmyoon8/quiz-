import React, {useState, useLayoutEffect} from 'react';
import {
   Alert,
   ScrollView,
   StyleSheet,
   View,
   Text,
   TouchableOpacity,
} from 'react-native';
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
   MainFontColor,
   SliderThumbColor,
   SliderTrackColor,
   SubFontColor,
   BackgroundColor,
   BottomDividerColor,
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

const MainScreen = ({navigation}: MainStackScreenProps) => {
   const [numberOfQuiz, setNumberOfQuiz] = useState(1);
   const [selectedCategory, setSelectedCategory] = useState('');
   const [difficulty, setDifficulty] = useState('');
   const [quizType, setQuizType] = useState('');

   const [isNumberOfQuizExtends, setIsNumberQuizExtends] = useState(false);
   const [isCategoryExtends, setIsCategoryExtends] = useState(false);
   const [isDifficultyExtends, setIsDifficultyExtends] = useState(false);
   const [isQuizType, setIsQuizType] = useState(false);
   const [isWrongAnswerExtends, setIsWrongAnswerExtends] = useState(false);

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
   const difficultyHandler = (difficulty: string) => {
      setDifficulty(difficulty);
      setIsDifficultyExtends(false);
   };
   const quizTypeHandler = (quizType: string) => {
      setQuizType(quizType);
      setIsQuizType(false);
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
               title="퀴즈 고르기"
               navigation={navigation}
               difficulty={difficulty}
               numberOfQuiz={numberOfQuiz}
               quizType={quizType}
               category={selectedCategory}
            />
         ),
      });
   }, [difficulty, numberOfQuiz, quizType, selectedCategory]);
   useLayoutEffect(() => {
      // 자동으로 퀴즈 가져오기
      const getParsing = getParsingQuizOption(
         selectedCategory,
         difficulty,
         quizType,
         numberOfQuiz,
      );
      if (selectedCategory && difficulty && quizType && numberOfQuiz) {
         dispatcher(getQuizThunk(getParsing));
      }
   }, [selectedCategory, difficulty, quizType, numberOfQuiz]);
   useLayoutEffect(() => {
      // 퀴즈가 없으면 다시 검색해달라는 메세지 띄우기
      if (selectedCategory && difficulty && quizType && numberOfQuiz) {
         if (getQuiz.length <= 0) {
            Alert.alert('퀴즈가 없습니다 다른옵션으로 다시 검색해주세요!');
         }
      }
   }, [getQuiz]);
   useLayoutEffect(() => {
      if (isFocus) {
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
         setIsQuizType(false);
         setIsWrongAnswerExtends(false);
      }
   }, [isFocus]);

   return (
      <>
         <ScrollView bounces={false} style={styles.container}>
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
                     title="총 문항"
                     subTitle={`${numberOfQuiz * 10} 문항`}
                  />
               }
               isExpanded={isNumberOfQuizExtends}
               onPress={() => setIsNumberQuizExtends(!isNumberOfQuizExtends)}>
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
                     title="퀴즈 난이도"
                  />
               }
               isExpanded={isDifficultyExtends}
               onPress={() => {
                  setIsDifficultyExtends(!isDifficultyExtends);
               }}>
               {isDifficultyExtends &&
                  quizOptions.SelectDifficulty.map(difficulty => (
                     <TouchableOpacity
                        key={difficulty}
                        activeOpacity={0.4}
                        onPress={() => difficultyHandler(difficulty)}
                        style={styles.listItemContainer}>
                        <Text style={styles.accordionContentBoxSubFont}>
                           {difficulty}
                        </Text>
                     </TouchableOpacity>
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
                     title="퀴즈 형식"
                  />
               }
               isExpanded={isQuizType}
               onPress={() => {
                  setIsQuizType(!isQuizType);
               }}>
               {isQuizType &&
                  quizOptions.SelectType.map(quizType => (
                     <TouchableOpacity
                        key={quizType}
                        activeOpacity={0.4}
                        onPress={() => quizTypeHandler(quizType)}
                        style={styles.listItemContainer}>
                        <Text style={styles.accordionContentBoxSubFont}>
                           {quizType}
                        </Text>
                     </TouchableOpacity>
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
                     title="퀴즈 유형"
                  />
               }
               isExpanded={isCategoryExtends}
               onPress={() => {
                  setIsCategoryExtends(!isCategoryExtends);
               }}>
               {isCategoryExtends &&
                  quizOptions.SelectCategory.map(category => (
                     <TouchableOpacity
                        activeOpacity={0.4}
                        key={category}
                        onPress={() => categoryHandler(category)}
                        style={styles.listItemContainer}>
                        <Text style={styles.accordionContentBoxSubFont}>
                           {category}
                        </Text>
                     </TouchableOpacity>
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
                     title="오답노트"
                  />
               }
               isExpanded={isWrongAnswerExtends}
               onPress={() => {
                  setIsWrongAnswerExtends(!isWrongAnswerExtends);
               }}>
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
         </ScrollView>
      </>
   );
};

export default MainScreen;

const styles = StyleSheet.create({
   container: {
      paddingHorizontal: 12,
      paddingTop: 10,
      height: '100%',
      backgroundColor: BackgroundColor,
   },
   accordionContentStyle: {
      paddingHorizontal: 4,
      borderBottomWidth: 1.3,
      borderBottomColor: C56D8AE,
   },
   accordionContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   accordionContentBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   accordionContentBoxMainFont: {
      color: MainFontColor,
      fontWeight: '700',
      fontSize: 18,
   },
   accordionContentBoxSubFont: {
      color: SubFontColor,
      fontWeight: '700',
      marginVertical: 4,
   },
   marginLeft8: {marginLeft: 8},
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
   listItemContainer: {
      height: 43.3,
      justifyContent: 'center',
      paddingHorizontal: 14,
      borderBottomColor: BottomDividerColor,
      borderBottomWidth: 0.3,
   },
});
