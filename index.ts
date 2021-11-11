import {
  ActionCreator,
  configureStore,
  createAction,
  Dispatch,
  Reducer,
} from "@reduxjs/toolkit";

const userActions = {
  add: createAction<number, "user/add">("user/add"),
  remove: createAction<string, "user/remove">("user/remove"),
};

const customerActions = {
  charge: createAction<void, "customer/charge">("customer/charge"),
};

const appActions = {
  userActions,
  customerActions,
};

type ActionType<T extends any> = T extends ActionCreator<any>
  ? ReturnType<T>
  : { [K in keyof T]: ActionType<T[K]> }[keyof T];

// Example usage of ActionType
type UserAction = ActionType<typeof userActions>;
// type UserAction = {
//     payload: number;
//     type: "user/add";
// } | {
//     payload: string;
//     type: "user/remove";
// }

type CustomerAction = ActionType<typeof customerActions>;
// type CustomerAction = {
//     payload: undefined;
//     type: "customer/charge";
// }

type AppAction = ActionType<typeof appActions>;
// type AppAction =
//   | {
//       payload: number;
//       type: "user/add";
//     }
//   | {
//       payload: string;
//       type: "user/remove";
//     }
//   | {
//       payload: undefined;
//       type: "customer/charge";
//     };

type AppDispatch = Dispatch<AppAction>;

const dispatch: AppDispatch = (action) => action;

dispatch(userActions.add(1)); // OK

// All of the following produce type errors as desired
dispatch(undefined);
dispatch("user/add");
dispatch(userActions.add); // forgot to call the action creator
dispatch({ type: "user/add", payload: "wrong payload type" });
dispatch({ type: "nonExistentActionType" });

//
// Bonus: integration with configureStore
//
type AppState = { foobar: number };

const appReducer: Reducer<AppState, AppAction> = (
  state = { foobar: 0 },
  action: AppAction
) => state;

const store = configureStore<AppState, AppAction>({ reducer: appReducer });

store.dispatch(userActions.add(0)); // OK
store.dispatch("user/add"); // ERROR

store.dispatch(() => Promise.resolve(userActions.add(0))); // OK
store.dispatch(() => Promise.resolve({ type: "nonExistentActionType" })); // OK when it ideally wouldn't be
