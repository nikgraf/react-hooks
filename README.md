# Collection of React Hooks

## Website

[https://nikgraf.github.io/react-hooks/](https://nikgraf.github.io/react-hooks/)

## Planned Features

- Add Type System Info e.g. TypeScript, Flow, Reason
- Add information from Github and NPM

## State Management with React Hooks

### As of React v16.8, Hooks have allowed implementation of a number of React features in a component without writing a class. Hooks brought vast benefits to the way React developers write code. This includes code re-use and easier ways of sharing state between components. For this tutorial, we will be concerned with the following React hooks:

#### useState
#### useReducer
useState is recommended for handling simple values like numbers or strings. However, when it comes to handling complex data structures, you will need useReducer hook. For useState, you only need to have a single setValue() function for overwriting existing state values.

Once you declare your state using either useState or useReducer, you’ll need to lift it up to become global state using React Context. This is done by creating a Context Object using the createContext function provided by the React library. A context object allows state to be shared among components without using props
