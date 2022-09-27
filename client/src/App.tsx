import { useState } from 'react';
import './App.css';
import useSocket from './context/socket';

function App() {
  const socket = useSocket();
  const [isTestVisible, setIsTestVisible] = useState(false);
  function onClick() {
    (document.getElementById("good") as HTMLInputElement).value="bb"
    socket.emit("beginTest");
    setIsTestVisible(true);
    socket.once("aa", (msg) => {
      console.log(msg)
    })
  }

  return (<div className="grid grid-flow-6 h-screen">
    <div className="bg-black grid grid-cols-3 gap-2">
      <div className="text-white text-sm">wifi</div>
      <div className="text-center ">
        <p className="text-white text-sm">Roobuck</p>
      </div>
      <div className="grid grid-flow-3 text-white text-sm text-right">
        <div className="row-span-2 text-sm">bb</div>
        <div className="mb-0">clock</div>
      </div>
    </div>
    <div className=" row-span-4 items-center text-center">
      {/* <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg  items-center space-x-4"> */}
      <div className='flex flex-row'>
      <p className="text-xl font-medium text-primary">ID:</p>
      <p className="text-xl font-medium text-primary">ID</p>
      </div>
        
        <p className="text-secondary">You have a new message!</p>
        {/* <input type="text"id="good" className="text-xl font-medium text-primary"></input> */}
        <button onClick={onClick}>start</button>
      {/* </div> */}
    </div>
    <div className="bg-black">bottom</div>
  </div>);
}
//a
export default App;
