import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import Clock from './comment/Clock';
import useSocket from './context/socket';
import Personalinfo from './personnalinfo';
function App() {
  const socket = useSocket();
  socket.emit("beginTest")
  const [macAddress, setMacAddress] = useState<string>();
  const [SN, setSN] = useState<string>();
  const [State, setState] = useState<Element>();
  function onclick() {
    console.log("a")


  }
  useEffect(() => {
    socket.on("MAC", (msg) => {
      if (msg && typeof msg === "string") {
        const mac = msg
        setMacAddress(mac);
      } else {
        console.error("Received invalid MAC Address");
      }
    });
    socket.on('SN', (msg) => {
      setSN(msg)
    });
    return function socketCleanup() {
      socket.removeAllListeners("MAC");
      socket.removeAllListeners("SN")
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
        {/* <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg  items-center space-x-4"> */}
        <Personalinfo></Personalinfo>
        <button onClick={onclick}>cc</button>
        {/* <table>
            <tbody>
              <tr><td>MAC:</td><td>{macAddress}</td></tr>
              <tr><td>SN:</td><td>{SN}</td></tr>
            </tbody>
          </table> */}
      </div>
      <div className="bg-roobuck-blue">bottom</div>
    </div>);
}
export default App;
