import {GetQuizParamProps} from '../QuizMain/types/quizMainStackNavigationTypes';
import {QuizType} from '../QuizMain/types/quizMainTypes';

export interface QuizOptions {
   NumberQuestions: number;
   SelectCategory: string[];
   SelectDifficulty: string[];
   SelectType: string[];
}

export interface WrongAnswerNoteType {
   selectAnswer: string[];
   getShuffleQuiz: QuizType[];
   quizId: string;
   solvedDate: String;
   selectedOption: GetQuizParamProps;
   result: {correct: number; inCorrect: number};
   getQuizTimer: {
      hour: string;
      minuts: string;
      seconds: string;
   };
   startTime: any;
}
