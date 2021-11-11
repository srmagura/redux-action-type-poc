import { ActionCreator, createAction, Dispatch } from "@reduxjs/toolkit";

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

type ValuesOf<T> = T[keyof T];

type ActionType<T extends any> = T extends ActionCreator<any>
  ? ReturnType<T>
  : ValuesOf<{ [K in keyof T]: ActionType<T[K]> }>;

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
