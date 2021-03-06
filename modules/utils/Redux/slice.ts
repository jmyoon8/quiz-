import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';
import {GetQuizParamProps} from '../../QuizMain/types/quizMainStackNavigationTypes';
import {instance} from '../axiosInstance';
import {ReduxDefaultProps} from './reduxType';

export const getQuizThunk = createAsyncThunk(
   'quiz/getQuiz',
   async ({amount, category, difficulty, type}: GetQuizParamProps) => {
      const {data} = await instance.get('', {
         params: {
            amount,
            category,
            difficulty,
            type,
         },
      });
      return {data};
   },
);

const Slice = createSlice<ReduxDefaultProps, any, any>({
   name: 'quiz',
   initialState: {
      apiState: '',
      shuffleQuiz: [],
      quizTimerState: {
         hour: '',
         minuts: '',
         seconds: '',
      },
   },

   reducers: {
      resetQuiz: (state: ReduxDefaultProps) => {
         state.shuffleQuiz = [];
      },

      setQuizTimerState: (state: ReduxDefaultProps, action: any) => {
         state.quizTimerState.hour = action.payload.hour;
         state.quizTimerState.minuts = action.payload.minuts;
         state.quizTimerState.seconds = action.payload.seconds;
      },
   },

   extraReducers: builder => {
      builder.addCase(getQuizThunk.pending, state => {
         state.apiState = 'pending';
      });
      builder.addCase(
         getQuizThunk.fulfilled,
         (state: ReduxDefaultProps, action) => {
            const results = action.payload.data.results;
            state.apiState = '';

            let cloneQuiz = [...results];
            for (let i = 0; i < cloneQuiz.length; i++) {
               cloneQuiz[i].answers = cloneQuiz[i].incorrect_answers;
               cloneQuiz[i].answers.push(cloneQuiz[i].correct_answer);
               cloneQuiz[i].answers = _.shuffle(cloneQuiz[i].answers);
            }

            state.shuffleQuiz = cloneQuiz;
         },
      );
      builder.addCase(getQuizThunk.rejected, state => {
         state.apiState = 'rejected';
      });
   },
});
export const {resetQuiz, setQuizTimerState} = Slice.actions as any;
export default Slice.reducer;
