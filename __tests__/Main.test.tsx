/**
 * @format
 */

import 'react-native';
import React from 'react';
import {fireEvent, render, RenderAPI} from '@testing-library/react-native';
import MainScreen from '../modules/QuizMain/Screen/MainScreen';
import MainStackScreenHeader from '../modules/QuizMain/Components/MainStackScreenHeader';
import {DisabledColor} from '../modules/utils/Styles';
import {MainStackScreenHeaderProps} from '../modules/QuizMain/types/componentType';
import {MockingNavigatorComponent, MockingProvier} from './testUtils.test';
import {navigationMocking} from '../mock';

let MainRendered: RenderAPI | undefined;
let MainHeader: RenderAPI | undefined;
let mainHeaderProps: MainStackScreenHeaderProps = {
   navigation: navigationMocking,
   title: '퀴즈 고르기',
   difficulty: '쉬움',
   numberOfQuiz: 10,
   quizType: '객관식',
   category: '일반상식',
};

beforeEach(() => {
   MainRendered = render(
      <MockingNavigatorComponent
         Component={() => (
            <MainScreen
               navigation={navigationMocking}
               route={{
                  key: '',
                  name: 'SelectQuizOption',
               }}
            />
         )}
      />,
   );
   MainHeader = render(
      <MockingProvier
         Component={() => <MainStackScreenHeader {...mainHeaderProps} />}
      />,
   );
});
const testId: string[] = [
   'numberOfQuiz',
   'quizDifficulty',
   'quizType',
   'quizCategory',
];
describe('main component visible test', () => {
   for (let i = 0; i < testId.length; i++) {
      test(`select ${testId[i]} visible test`, () => {
         if (MainRendered) {
            let getHasTestIdElement = MainRendered.getByTestId(testId[i]);
            fireEvent(getHasTestIdElement, 'onPress');
            expect(getHasTestIdElement.props.isExpanded).toBeFalsy();
         }
      });
   }
   test('headerComponent recived props well?', () => {
      if (MainHeader) {
         const getElementTitle = MainHeader.getByText(mainHeaderProps.title);
         expect(getElementTitle.props.children).toBe(mainHeaderProps.title);
         const getElementConfirm = MainHeader.getByText('퀴즈를 골라주세요!');
         expect(getElementConfirm.props.style.color).toBe(DisabledColor);
      }
   });
});
