import xs, {Stream, MemoryStream} from 'xstream';
import * as Immutable from 'immutable';
import MatrixValues from '../utils/MatrixValues';

export interface State {
  values: MatrixValues;
  editable: boolean;
  id: string;
}

export type Reducer = (state: State) => State;

export interface Action {
  row: number;
  col: number;
  val: number;
}

const defaultState: State = {
  values: MatrixValues.ofDimensions(1, 1),
  editable: true,
  id: `matrix${Math.round(Math.random()*1000)}`,
};

/**
 * Controls modifications to state, through the emission of reducer functions.
 */
export default function model(action$: Stream<Action>): Stream<Reducer> {
  const inputReducer$ = action$.map(a =>
    function inputReducer(old: State): State {
      return Immutable.Map<string, any>(old).updateIn(['values'], oldVals =>
        oldVals.set(a.row, a.col, a.val)
      ).toJS();
    }
  );

  const initReducer$ = xs.of(function initReducer(prevState: State): State {
    if (!prevState) {
      return defaultState;
    } else {
      return prevState;
    }
  });

  return xs.merge(inputReducer$, initReducer$);
}