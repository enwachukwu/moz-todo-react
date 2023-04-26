import React, { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Webcam from "react-webcam";
import Todo from "./components/Todo";
import './index.css'; 
import { nanoid } from "nanoid";
import { DeletePhotoSrc } from "./db.js"
import Message from "./components/Message";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  // see geolocation on MDN, URL supplied in DWT chat on 10/2/22
  function geoFindMe() {
    console.log("geoFindMe", lastInsertedId);
    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
      //mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      // # OSM URL includes hash which breaks link for some SMS recipients (depends on phone) so use Google 
      // smsURL: `sms://00447700900xxxx?body=https://www.openstreetmap.org/#map=18/${latitude}/${longitude}` 
      console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
      locateTask(lastInsertedId, 
        {
          latitude: latitude, 
          longitude: longitude, 
          error: "",
          mapURL: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`,
         smsURL: `sms://00447960441959?body=https://maps.google.com/?q=${latitude},${longitude}` 
        });
    }
    function error() {
      console.log('Unable to retrieve your location');
    }
    if(!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      console.log( 'Locating…');
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }


  function usePersistedState(key, defaultValue) {
    const [state, setState] = React.useState(
      () => JSON.parse(localStorage.getItem(key)) || defaultValue
    );
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  }


  const [tasks, setTasks] = usePersistedState('tasks',[]);
  const [filter, setFilter] = useState('All');
  const [lastInsertedId, setLastInsertedId] = useState('');



  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new obkect
        // whose `completed` prop has been inverted
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  }


  function deleteTask(id) {
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);

    DeletePhotoSrc(id);
  }

  function editTask(id, newName) {
    console.log("editTask before");
    console.log(tasks);
    const editedTaskList = tasks.map(task => {
    // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return {...task, name: newName}
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  function locateTask(id, location) {
    console.log("locate Task", id, " before");
    console.log(location, tasks);
    const locatedTaskList = tasks.map(task => {
    // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return {...task, location: location}
      }
      return task;
    });
    console.log(locatedTaskList);
    setTasks(locatedTaskList);
  }

  function photoedTask(id) {
    console.log("photoedTask", id);
    const photoedTaskList = tasks.map(task => {
    // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return {...task, photo: true}
      }
      return task;
    });
    console.log(photoedTaskList);
    setTasks(photoedTaskList);
  }

  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map(task => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      location={task.location}
      toggleTaskCompleted={toggleTaskCompleted}
      photoedTask={photoedTask}
      deleteTask={deleteTask}
      editTask={editTask}
   
    />
  ));

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name) {
    const id = "todo-" + nanoid();
    const newTask = { id: id, name: name, completed: false, location: {latitude:"##", longitude:"##", error:"##"} };
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
  }


  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length); 

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large mx-auto bg-sky-800">
      <Form addTask={addTask} geoFindMe={geoFindMe}/>
      <div className="filters btn-group stack-exception bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      { <Webcam  width={250} height={250} padding={50} />  }
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
      <Message/>
    </div>
  );
}

export default App;