import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import Clock from './comment/Clock';
import Footer from './comment/Footer';
import useSocket from './context/socket';
interface RoobuckTag {
  MAC: string;
  SN: string;
}
function App() {
  const socket = useSocket();
  socket.connect();
  socket.emit("beginTest");
  const [LampInfo, setLampInfo] = useState<RoobuckTag>();
  const [ID, setID] = useState<string>();

  useEffect(() => {
    socket.on("test",()=>
    {
      console.log("A")
    })
    socket.on("LampInfo", (msg) => {
      setLampInfo(msg);
    });
    socket.on("PeopleID", (msg) => {
      setID(msg);
    });
    socket.on("ReadyForNext", (msg) => {
      if (msg) {
        setLampInfo(undefined);
        setID(undefined);
      }
    })
    return function socketCleanup() {
      socket.removeAllListeners("LampInfo");
      socket.removeAllListeners("PeopleID");
    };

  });
  return (
    <div className="grid grid-flow-6 h-screen">
      <div className="bg-roobuck-blue grid grid-cols-3 gap-2">
        <div className="text-white text-sm">wifi</div>
        <div className="text-center ">
          <p className="text-white text-sm">Roobuck</p>
        </div>
        <div className="grid grid-flow-3 text-white text-sm text-right">
          <div className="row-span-2 text-sm">bb</div>
          <div className="mb-0"><Clock timer={10000} /></div>
        </div>
      </div>
      <div className="bg-black row-span-4 items-center text-center">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg  items-center space-x-4">
          <table>
            <tbody>
              <tr><td>ID:</td><td>{ID}</td></tr>
              <tr><td>MAC:</td><td>{LampInfo?.MAC}</td></tr>
              <tr><td>SN:</td><td>{LampInfo?.SN}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className='bg-black row-span-1' >
        <Footer version={''}></Footer>
      </div>
    </div>);
}
export default App;
