import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";


/*
 const DATA = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false }
]; 

  localStorage.setItem('tasks',JSON.stringify(DATA))
  */
 // const DATA = JSON.parse(localStorage.getItem('tasks')) || [];
  const DATA = [];

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App tasks={DATA} />
      </React.StrictMode>


); 



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorkerRegistration.register();

