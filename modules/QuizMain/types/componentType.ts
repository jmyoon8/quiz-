import React from 'react';
import {WrongAnswerNoteType} from '../../utils/utilsTypes';
import {
   GetQuizParamProps,
   MainStackScreenHeaderNavigationProps,
   QuizStackScreenHeaderNavigationProps,
} from './quizMainStackNavigationTypes';
import {QuizType} from './quizMainTypes';

export interface MainStackScreenHeaderProps {
   navigation: MainStackScreenHeaderNavigationProps;
   title: string;
   category: string;
   difficulty: string;
   quizType: string;
   numberOfQuiz: number;
}
export interface AccordianContentProps {
   title: string;
   subTitle: string;
   Icon: any;
}
export interface SolvingQuizStackScreenHeaderProps {
   navigation: QuizStackScreenHeaderNavigationProps;
   title: string;
}

export interface QuizStartModalProps {
   setQuizStartModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
   quizStartModalVisible: boolean;
   selectedOption: GetQuizParamProps;
   setStartTime: React.Dispatch<React.SetStateAction<any>>;
   navigation: QuizStackScreenHeaderNavigationProps;
   setIsFinish: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface SolvingQuizTopInfoProps {
   title: string;
   subTitle: string;
}
export interface SolvingQuizTimerProps {
   startTime: string;
   isFinish: boolean;
}
export interface QuizAnswersProps {
   currentQuizInfo: QuizType;
   selectAnswerHandler: (selectedAnswer: any) => void;
   selectAnswer: string[];
   currentQuizAmount: number;
   isWrongAnswerView: boolean;
}
export interface QuizCorrectMentProps {
   selectAnswer: string[];
   currentQuizAmount: number;
   currentQuizInfo: QuizType;
}
export interface QuizExplorerProps {
   currentQuizAmount: number;
   quizExplorerHandler: (whereGoing: 'next' | 'prev') => void;
   selectAnswer: string[];
}
export interface QuizFinishModalProps {
   quizFinishModalVisible: boolean;
   setQuizFinishModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
   getShuffleQuiz: QuizType[];
   selectAnswer: string[];
   setSelectAnswer: React.Dispatch<React.SetStateAction<string[]>>;
   setCurrentQuizAmount: React.Dispatch<React.SetStateAction<number>>;

   navigation: QuizStackScreenHeaderNavigationProps;
   selectedOption: GetQuizParamProps;
   quizId: string;
   setIsReplay: React.Dispatch<React.SetStateAction<boolean>>;
   isWrongAnswerView: boolean;
   setIsWrongAnswerView: React.Dispatch<React.SetStateAction<boolean>>;
   startTime: string;
   setQuizStartModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface WrongAnswerListItemProps {
   wrongAnswerNoteItem: WrongAnswerNoteType;
   goToWrongAnswerNoteHandler: (info: WrongAnswerNoteType) => void;
   deleteWrongAnswerNoteHandler: (id: string) => void;
}

export interface QuizOptionPoprs {
   option: string;
   optionHandler: (options: string) => void;
}
