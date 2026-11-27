import { answersSchema, validateField, type AnswerKey, type Answers, type Draft } from './answers';
import { QUESTIONS, keysOf } from './questions';

export type Screen = 'start' | 'question' | 'result' | 'guide';

/** Everything the user has done, held in memory only. Nothing here is saved anywhere. */
export interface FlowState {
  screen: Screen;
  step: number;
  draft: Draft;
  errors: Partial<Record<AnswerKey, string>>;
  answers: Answers | null;
  checked: string[];
  guide: string | null;
}

export type FlowAction =
  | { type: 'start' }
  | { type: 'set'; key: AnswerKey; value: unknown }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'edit' }
  | { type: 'toggle-item'; id: string }
  | { type: 'open-guide'; guide: string };

export const initialState: FlowState = {
  screen: 'start',
  step: 0,
  draft: {},
  errors: {},
  answers: null,
  checked: [],
  guide: null,
};

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'start':
      return { ...state, screen: 'question', step: 0 };

    case 'set': {
      const draft = { ...state.draft, [action.key]: action.value };
      // The name is checked as the user types; choices only clear their error.
      const error = action.key === 'name' ? validateField('name', action.value) : null;
      return { ...state, draft, errors: { ...state.errors, [action.key]: error ?? undefined } };
    }

    case 'next': {
      const question = QUESTIONS[state.step];
      if (!question) return state;
      const errors: FlowState['errors'] = {};
      for (const key of keysOf(question)) {
        const value = key === 'name' ? (state.draft.name ?? '') : state.draft[key];
        const error = validateField(key, value);
        if (error) errors[key] = error;
      }
      if (Object.keys(errors).length > 0) return { ...state, errors };
      if (state.step < QUESTIONS.length - 1) return { ...state, errors: {}, step: state.step + 1 };
      const parsed = answersSchema.safeParse({ name: '', ...state.draft });
      return parsed.success ? { ...state, errors: {}, screen: 'result', answers: parsed.data } : state;
    }

    case 'back':
      if (state.screen === 'guide') return { ...state, screen: 'result', guide: null };
      if (state.screen === 'result') return { ...state, screen: 'question', step: QUESTIONS.length - 1 };
      if (state.screen === 'question' && state.step === 0) return { ...state, screen: 'start', errors: {} };
      return { ...state, step: Math.max(0, state.step - 1), errors: {} };

    case 'edit':
      return { ...state, screen: 'question', step: 0, errors: {} };

    case 'toggle-item':
      return {
        ...state,
        checked: state.checked.includes(action.id)
          ? state.checked.filter((id) => id !== action.id)
          : [...state.checked, action.id],
      };

    case 'open-guide':
      return { ...state, screen: 'guide', guide: action.guide };
  }
}
