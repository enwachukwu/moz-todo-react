import React, { useEffect, useState } from "react";


function Form(props) {
  const [addition, setAddition] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (addition) {
      console.log("useEffec decteted addition");
      props.geoFindMe();
      setAddition(false);
    }
  }
  );
  
  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()){
      return;
    }
   
 
  setAddition(true);
  props.addTask(name);
  setName("");
}
  function handleChange(e) {
    setName(e.target.value);
  }
  
  
  return (
    <form onSubmit={handleSubmit}>
     <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
    />

      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;