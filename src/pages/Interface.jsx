import React, { useState } from "react";
import Image from "../assets/imgs/red-fresh-tomatoes-gathered-into-cardboaard-boxes-purchasing (1).jpg";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";

const Interface = () => {
  const [temp, setTemp] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [weight, setWeight] = useState(0);
  const [fanStatus, setFanStatus] = useState("");
  const [coolingStatus, setCoolingStatus] = useState("");
  const [humidifierStatus, setHumidifierStatus] = useState("");
  const [doorStatus, setDoorStatus] = useState("");
  const [fanSwitch, setFanSwitch] = useState(false);
  const [coolingSwitch, setCoolingSwitch] = useState(false);
  const [humidifierSwitch, setHumidifierSwitch] = useState(false);
  const [doorSwitch, setDoorSwitch] = useState(false);
  const [tempStatus, setTempStatus] = useState("");
  const [humidityStatus, setHumidityStatus] = useState("");

  function getTempStatus(tempValue) {
    if (tempValue <= 24) return "LOW";
    if (tempValue < 27) return "NORMAL";
    return "HIGH";
  }

  function getHumidityStatus(humidityValue) {
    if (humidityValue <= 77) return "LOW";
    if (humidityValue < 83) return "NORMAL";
    return "HIGH";
  }

  function getTempColor(status) {
    if (status === "LOW") return "bg-yellow-800/50";
    if (status === "NORMAL") return "bg-green-800/50";
    return "bg-red-800/50";
  }

  function getHumidityColor(status) {
    if (status === "LOW") return "bg-yellow-800/50";
    if (status === "NORMAL") return "bg-green-800/50";
    return "bg-red-800/50";
  }

  function fanToggle() {
    setFanSwitch(!fanSwitch);
    setFanStatus(fanSwitch ? "OFF" : "ON");
  }

  function coolingToggle() {
    setCoolingSwitch(!coolingSwitch);
    setCoolingStatus(coolingSwitch ? "OFF" : "ON");
  }

  function humidifierToggle() {
    setHumidifierSwitch(!humidifierSwitch);
    setHumidifierStatus(humidifierSwitch ? "OFF" : "ON");
  }

  function doorToggle() {
    setDoorSwitch(!doorSwitch);
    setDoorStatus(doorSwitch ? "CLOSED" : "OPEN");
  }

  function fetchData() {
    const tempValue = 30.8;
    const humidityValue = 100;
    const weightValue = 60;

    setTemp(tempValue);
    setHumidity(humidityValue);
    setWeight(weightValue);
    setTempStatus(getTempStatus(tempValue));
    setHumidityStatus(getHumidityStatus(humidityValue));
    setFanStatus("OFF");
    setCoolingStatus("OFF");
    setHumidifierStatus("OFF");
    setDoorStatus("CLOSED");
  }

  // React.useEffect(() => {
  //   fetchData();

  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  React.useEffect(() => {
    // subscribe to realtime updates at the path 'sensors'
    const sensorsRef = ref(database, "sensors"); // <-- change this to your actual path
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const tempValue = data.temp ?? 0;
      const humidityValue = data.humidity ?? 0;
      const weightValue = data.weight ?? 0;

      setTemp(tempValue);
      setHumidity(humidityValue);
      setWeight(weightValue);
      setTempStatus(getTempStatus(tempValue));
      setHumidityStatus(getHumidityStatus(humidityValue));

      setFanStatus(data.fanStatus ?? "OFF");
      setCoolingStatus(data.coolingStatus ?? "OFF");
      setHumidifierStatus(data.humidifierStatus ?? "OFF");
      setDoorStatus(data.doorStatus ?? "CLOSED");

      setFanSwitch((data.fanStatus ?? "OFF") === "ON");
      setCoolingSwitch((data.coolingStatus ?? "OFF") === "ON");
      setHumidifierSwitch((data.humidifierStatus ?? "OFF") === "ON");
      setDoorSwitch((data.doorStatus ?? "CLOSED") === "OPEN");
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className=' w-fit h-fit bg-black/3 gap-[30px] flex max-md:flex-col justify-center py-[20px]  '>
      <section w-full flex-1>
        <div className=' bg-[#e2e2e2] py-[10px] px-[10px] rounded-md lg:mb-4 mb-2 w-[80%] mx-auto '>
          <h1 className=' text-green-800 text-center mb-[20px] '>
            {" "}
            WELCOME BACK{" "}
          </h1>
        </div>
        <section className=' bg-white rounded-[20px] max-md:[ py-[20px] text-center ] lg:p-[30px] lg:space-y-[20px] '>
          <h1 className=' bg-green-950/50 w-fit max-md:mx-auto max-md:mb-[10px] max-md:p-[10px] max-md:text-center   lg:px-[20px] lg:text-[20px] font-bold lg:py-[10px] rounded-[20px] '>
            STORAGE CONDITION
          </h1>
          <section className=' flex max-md:items-center max-md:flex-col gap-[20px]  w-full lg:w-fit '>
            <div className=' w-[50%] space-x-[20px] space-y-[30px] '>
              <p className=' text-[15px] text-red-700 bg-red-700/20 rounded-full border border-red-700 px-[20px] py-[10px] '>
                TEMPERATURE
              </p>
              <h1 className=' text-[50px] '>
                {temp}
                <span>°C</span>
              </h1>
              <p
                className={`text-black font-bold text-center px-[10px] py-[5px] rounded-[20px] ${getTempColor(
                  tempStatus
                )}`}
              >
                {tempStatus}
              </p>
            </div>
            <div className=' w-[50%] space-x-[20px] space-y-[30px] '>
              <p className=' text-[15px] text-red-700 bg-red-700/20 rounded-full border border-red-700 px-[20px] py-[10px] '>
                HUMIDITY
              </p>
              <h1 className=' text-[50px] '>
                {humidity}
                <span>%</span>
              </h1>
              <p
                className={`text-black font-bold text-center px-[10px] py-[5px] rounded-[20px] ${getHumidityColor(
                  humidityStatus
                )}`}
              >
                {humidityStatus}
              </p>
            </div>
            <div className=' w-[50%] space-x-[20px] space-y-[30px] '>
              <p className=' text-[15px] text-red-700 bg-red-700/20 rounded-full border border-red-700 px-[20px] py-[10px] '>
                WEIGHT
              </p>
              <h1 className=' text-[50px] '>
                {weight}
                <span>KG</span>
              </h1>

              <div className='relative bg-green-900/50 w-[100%] h-[40px] rounded-full mt-[10px]'>
                <div
                  className={`h-full rounded-full absolute transition-all ${
                    weight >= 51 ? "bg-red-600" : "bg-green-950"
                  }`}
                  style={{ width: `${Math.min((weight / 50) * 100, 100)}%` }}
                ></div>
              </div>
              <p className='text-center text-sm font-semibold'>
                {Math.min(weight, 50)}/50 KG
              </p>
            </div>
          </section>
        </section>
        <section className='   max-md:[ rounded-[20px] bg-white py-[20px] ] flex max-md:flex-col items-center gap-[20px] mt-[30px] w-full max-md:h-fit '>
          <div className=' w-[50%] bg-white rounded-[20px] space-y-[20px] p-[30px] '>
            <p
              className={`  text-black font-bold text-center px-[10px] py-[5px] rounded-[20px] ${
                fanSwitch ? "bg-red-800/50 text-red-950" : "bg-green-800/50"
              } `}
            >
              FAN
            </p>
            <p className=' font-black text-[40px] text-center '>{fanStatus}</p>
            <div
              onClick={fanToggle}
              className={`relative bg-green-900/50 w-[100%] h-[40px] rounded-full mt-[10px]  `}
            >
              <div
                className={` bg-green-950 h-full w-[50%] rounded-full absolute ></div ${
                  fanSwitch ? "translate-x-full" : "translate-x-0"
                } `}
              ></div>
            </div>
          </div>
          <div className=' w-[50%] bg-white rounded-[20px] p-[30px] space-y-[20px] '>
            <p
              className={`  text-black font-bold text-center px-[10px] py-[5px] rounded-[20px] ${
                coolingSwitch ? "bg-red-800/50 text-red-950" : "bg-green-800/50"
              } `}
            >
              COOLING
            </p>
            <p className=' font-black text-[40px] text-center '>
              {coolingStatus}
            </p>
            <div
              onClick={coolingToggle}
              className={`relative bg-green-900/50 w-[100%] h-[40px] rounded-full mt-[10px]  `}
            >
              <div
                className={` bg-green-950 h-full w-[50%] rounded-full absolute ></div ${
                  coolingSwitch ? "translate-x-full" : "translate-x-0"
                } `}
              ></div>
            </div>
          </div>
        </section>
      </section>
      <section className=' w-fit max-md:h-fit flex flex-col flex-1  '>
        <section className=' flex max-md:flex-col gap-[20px]  w-full'>
          <div className=' flex max-md:items-center max-md:bg-white max-md:rounded-[20px] max-md:py-[20px]  flex-col gap-[30px] '>
            <div className=' bg-white rounded-[20px] py-[30px] px-[50px] space-y-[20px] w-[200px] '>
              <p
                className={`  text-black font-bold text-center px-[10px] py-[5px] rounded-[20px] w-fit ${
                  humidifierSwitch
                    ? "bg-red-800/50 text-red-950"
                    : "bg-green-800/50"
                } `}
              >
                HUMIDIFIER
              </p>
              <p className=' font-black text-[40px] text-center  '>
                {humidifierStatus}
              </p>
              <div
                onClick={humidifierToggle}
                className={`relative bg-green-900/50 w-[100%] h-[40px] rounded-full mt-[10px]  `}
              >
                <div
                  className={` bg-green-950 h-full w-[50%] rounded-full absolute ></div ${
                    humidifierSwitch ? "translate-x-full" : "translate-x-0"
                  } `}
                ></div>
              </div>
            </div>
            <div className=' bg-white rounded-[20px] py-[30px] px-[50px] space-y-[20px] w-[200px] '>
              <p
                className={`  text-black font-bold text-center px-[10px] py-[5px] rounded-[20px] w-fit ${
                  doorSwitch ? "bg-red-800/50 text-red-950" : "bg-green-800/50"
                } `}
              >
                DOOR
              </p>
              <p className=' font-black text-[40px] text-center '>
                {doorStatus}
              </p>
              <div
                onClick={doorToggle}
                className={`relative bg-green-900/50 w-[100%] h-[40px] rounded-full mt-[10px]  `}
              >
                <div
                  className={` bg-green-950 h-full w-[50%] rounded-full absolute ></div ${
                    doorSwitch ? "translate-x-full" : "translate-x-0"
                  } `}
                ></div>
              </div>
            </div>
          </div>
          <div className=' relative aspect-[1/1] h-full w-full '>
            <h1 className=' absolute bg-green-900/50 px-[20px] py-[10px] rounded-[20px] right-[35%]  text-black font-bold '>
              YOUR PRODUCT
            </h1>
            <img
              src={Image}
              alt=''
              className=' w-[500px] h-full rounded-[20px] '
            />
          </div>
        </section>
        <div></div>
        <section className='  bg-white rounded-[20px] p-[30px] w-[100%] space-y-[20px] mt-[20px] '>
          <h1 className=' bg-green-950/50 w-fit px-[20px] text-[20px] font-bold py-[10px] rounded-[20px] '>
            QUICK TIPS
          </h1>
          <div className=' flex gap-[20px] '>
            <div className=' w-[50%] h-[200px] rounded-[20px] bg-black/40 '></div>
            <div className=' w-[50%] h-[200px] rounded-[20px] bg-black/40 '></div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Interface;
