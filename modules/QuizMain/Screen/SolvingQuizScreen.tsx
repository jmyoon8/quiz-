/* eslint-disable react-hooks/rules-of-hooks */
import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {
   ScrollView,
   StyleSheet,
   Text,
   View,
   Alert,
   BackHandler,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {v4 as uuid} from 'uuid';
import SolvingQuizHeader from '../Components/SolvingQuizHeader';
import {QuizStackScreenProps} from '../types/quizMainStackNavigationTypes';
import QuizStartModal from '../Components/QuizStartModal';
import {
   BackgroundColor,
   EnjoySolvingQuizColor,
   HeaderColor,
   MainFontColor,
} from '../../utils/Styles';
import SolvingQuizTopInfo from '../Components/SolvingQuizTopInfo';
import SolvingQuizTimer from '../Components/SolvingQuizTimer';
import {QuizType} from '../types/quizMainTypes';
import QuizAnswers from '../Components/QuizAnswers';
import QuizCorrectMent from '../Components/QuizCorrectMent';
import QuizExplorer from '../Components/QuizExplorer';
import QuizFinishModal from '../Components/QuizFinishModal';
import 'react-native-get-random-values';

const SolvingQuizScreen = ({navigation, route}: QuizStackScreenProps) => {
   useLayoutEffect(() => {
      navigation.setOptions({
         header: () => (
            <SolvingQuizHeader navigation={navigation} title="퀴즈퀴즈!" />
         ),
      });
   }, [navigation]);
   const {selectedOption, isWrongAnswerNotes, wrongAnswerNoteInfo} =
      route.params;
   const [startTime, setStartTime] = useState<any>('');

   const [isReplay, setIsReplay] = useState(false);
   const quizId = useMemo(() => {
      const id = uuid();
      return id;
      // 문제 다시풀기를 선택할경우 문제아이디를 재할당한다(문제 저장은 중복된 문제아이디로는 저장할수없다.)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isReplay]);

   // 스타트 모달은 오탑노트 보기가 아닐때만
   const [quizStartModalVisible, setQuizStartModalVisible] = useState(
      !isWrongAnswerNotes,
   );
   const [quizFinishModalVisible, setQuizFinishModalVisible] = useState(false);

   const [currentQuizAmount, setCurrentQuizAmount] = useState(0);

   const getShuffleQuiz: QuizType[] = isWrongAnswerNotes
      ? wrongAnswerNoteInfo?.getShuffleQuiz
      : useSelector((state: any) => state.slice.shuffleQuiz);

   const [selectAnswer, setSelectAnswer] = useState<string[]>(
      isWrongAnswerNotes
         ? (wrongAnswerNoteInfo?.selectAnswer as string[])
         : Array(getShuffleQuiz.length).fill(undefined),
   );
   const currentQuizInfo = getShuffleQuiz[currentQuizAmount];

   const [isFinish, setIsFinish] = useState(false);
   const [isWrongAnswerView, setIsWrongAnswerView] =
      useState(isWrongAnswerNotes);

   const isfocus = useIsFocused();
   const topInfoArr = useMemo(
      () => [
         {
            title: '퀴즈풀기',
            subtitle: selectedOption.category,
         },
         {
            title: '난이도',
            subtitle: selectedOption.difficulty,
         },
         {
            title: '퀴즈형식',
            subtitle: selectedOption.type,
         },
         {
            title: '진행사항',
            subtitle: `${selectedOption.amount} / ${currentQuizAmount + 1}`,
         },
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currentQuizAmount],
   );
   const selectAnswerHandler = (selectedAnswer: any) => {
      if (!selectAnswer[currentQuizAmount]) {
         selectAnswer.splice(currentQuizAmount, 1, selectedAnswer);
         setSelectAnswer([...selectAnswer]);
      }
   };
   const quizExplorerHandler = (whereGoing: 'next' | 'prev') => {
      if (whereGoing === 'next') {
         if (selectedOption.amount !== currentQuizAmount + 1) {
            setCurrentQuizAmount(currentQuizAmount + 1);
         } else {
            Alert.alert(
               '마지막 퀴즈입니다',
               '결과를 보시겠습니까?',
               [
                  {
                     text: '네! 볼래요!',
                     style: 'default',
                     onPress: () => {
                        setIsFinish(true);
                        setQuizFinishModalVisible(true);
                     },
                  },
                  {
                     text: '좀더 검토할께요!',
                     style: 'destructive',
                  },
               ],
               {cancelable: true},
            );
         }
      } else {
         if (currentQuizAmount > 1) {
            setCurrentQuizAmount(currentQuizAmount - 1);
         }
      }
   };

   useEffect(() => {
      const backFunc = () => {
         quizExplorerHandler('prev');
         return true;
      };

      const backHandler = BackHandler.addEventListener(
         'hardwareBackPress',
         backFunc,
      );

      return () => {
         backHandler.remove();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currentQuizAmount, isfocus]);

   return (
      <>
         <ScrollView bounces={false} style={styles.container}>
            <View style={styles.titleBox}>
               <Text style={styles.titleText}>퀴즈를 풀어보아요!</Text>
               {/* 문제풀때만 타이머 노출 */}
               {isWrongAnswerView || (
                  <SolvingQuizTimer startTime={startTime} isFinish={isFinish} />
               )}
            </View>
            <View style={styles.topInfoContainer}>
               {topInfoArr.map(item => (
                  <SolvingQuizTopInfo
                     key={item.title}
                     subTitle={item.subtitle as string}
                     title={item.title}
                  />
               ))}
            </View>
            <View style={styles.quizInfoContainer}>
               <View style={styles.questionContainer}>
                  <View style={styles.questionTitleBox}>
                     <Text style={styles.questionTitle}>
                        {currentQuizAmount + 1}.{' '}
                        {isWrongAnswerView ? '오답노트' : '문제'}
                     </Text>
                     <QuizCorrectMent
                        currentQuizAmount={currentQuizAmount}
                        currentQuizInfo={currentQuizInfo}
                        selectAnswer={selectAnswer}
                     />
                  </View>
                  <Text style={styles.questionText}>
                     {currentQuizInfo?.question}
                  </Text>
               </View>
               <View style={styles.answerContainer}>
                  <QuizAnswers
                     currentQuizAmount={currentQuizAmount}
                     currentQuizInfo={currentQuizInfo}
                     selectAnswer={selectAnswer}
                     selectAnswerHandler={selectAnswerHandler}
                     isWrongAnswerView={isWrongAnswerView}
                  />
               </View>
            </View>

            <QuizStartModal
               quizStartModalVisible={quizStartModalVisible}
               setQuizStartModalVisible={setQuizStartModalVisible}
               selectedOption={selectedOption}
               setStartTime={setStartTime}
               navigation={navigation}
               setIsFinish={setIsFinish}
            />
            {/*  quizFinishModalVisible 으로 콤포넌트 마운트 언마운트 분기처리되는점 제거*/}
            <QuizFinishModal
               selectAnswer={selectAnswer}
               getShuffleQuiz={getShuffleQuiz}
               quizFinishModalVisible={quizFinishModalVisible}
               setQuizFinishModalVisible={setQuizFinishModalVisible}
               setSelectAnswer={setSelectAnswer}
               setCurrentQuizAmount={setCurrentQuizAmount}
               navigation={navigation}
               selectedOption={selectedOption}
               quizId={quizId}
               setIsReplay={setIsReplay}
               setIsWrongAnswerView={setIsWrongAnswerView}
               isWrongAnswerView={isWrongAnswerView}
               startTime={startTime}
               setQuizStartModalVisible={setQuizStartModalVisible}
            />
         </ScrollView>
         <QuizExplorer
            currentQuizAmount={currentQuizAmount}
            quizExplorerHandler={quizExplorerHandler}
            selectAnswer={selectAnswer}
         />
      </>
   );
};

export default SolvingQuizScreen;

const styles = StyleSheet.create({
   container: {flex: 1, backgroundColor: BackgroundColor},
   titleBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
      backgroundColor: EnjoySolvingQuizColor,
   },
   titleText: {
      color: BackgroundColor,
      fontWeight: '900',
      fontSize: 18,
   },
   topInfoContainer: {
      flexDirection: 'row',
      height: 60,
   },
   quizInfoContainer: {
      paddingTop: 12,
      paddingHorizontal: 16,
      flex: 1,
   },
   questionContainer: {
      backgroundColor: BackgroundColor,
      minHeight: 60,
      justifyContent: 'space-between',
   },
   questionTitleBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 30,
   },
   questionTitle: {
      color: HeaderColor,
      fontWeight: '500',
      fontSize: 18,
   },

   questionText: {
      color: MainFontColor,
      fontSize: 17,
      marginTop: 20,
      fontWeight: '600',
   },
   answerContainer: {
      marginTop: 15,
      minHeight: 140,
      justifyContent: 'space-around',
   },
});
