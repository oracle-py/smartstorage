import React, { useState, useEffect } from "react";
import Image from "../assets/imgs/red-fresh-tomatoes-gathered-into-cardboaard-boxes-purchasing (1).jpg";
import { database } from "../firebase";
// FIXED: Added missing imports
import { ref, onValue, query, orderByKey, limitToLast } from "firebase/database";
import { 
  FaFan, 
  FaSnowflake, 
  FaTint, 
  FaDoorOpen, 
  FaDoorClosed,
  FaWeight,
  FaThermometerHalf,
  FaTint as FaHumidity
} from "react-icons/fa";

const Interface = () => {
  // State for sensor data
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [weight, setWeight] = useState(0);
  
  // State for actuator status (0/1 from database)
  const [fan, setFan] = useState(0);
  const [cooling, setCooling] = useState(0);
  const [humidifier, setHumidifier] = useState(0);
  const [doorstate, setDoorstate] = useState(0);
  
  // Loading state to prevent flash
  const [isLoading, setIsLoading] = useState(true);
  
  // Status indicators
  const [tempStatus, setTempStatus] = useState("NORMAL");
  const [humidityStatus, setHumidityStatus] = useState("NORMAL");

  // Status colors
  const statusColors = {
    LOW: "bg-yellow-500/20 text-yellow-700 border-yellow-500",
    NORMAL: "bg-green-500/20 text-green-700 border-green-500",
    HIGH: "bg-red-500/20 text-red-700 border-red-500"
  };

  // Convert 0/1 to user-friendly strings
  const getActuatorStatus = (value) => value === 1 ? "OFF" : "ON";
  const getDoorStatus = (value) => value === 1 ? "OPEN" : "CLOSED";

  // Icon states based on 0/1
  const getActuatorIconClass = (value) => 
    value === 1 ? "text-blue-600 animate-pulse" : "text-gray-400";
  
  const getDoorIconClass = (value) => 
    value === 1 ? "text-red-600 animate-pulse" : "text-green-600";

  // Calculate temperature status (using your thresholds)
  function getTempStatus(tempValue) {
    if (tempValue <= 24) return "LOW";
    if (tempValue < 27) return "NORMAL";
    return "HIGH";
  }

  // Calculate humidity status (using your thresholds)
  function getHumidityStatus(humidityValue) {
    if (humidityValue <= 77) return "LOW";
    if (humidityValue < 83) return "NORMAL";
    return "HIGH";
  }

  // Get temperature icon color
  function getTempIconColor(status) {
    switch(status) {
      case "LOW": return "text-blue-500";
      case "HIGH": return "text-red-500";
      default: return "text-green-500";
    }
  }

  // Get humidity icon color
  function getHumidityIconColor(status) {
    switch(status) {
      case "LOW": return "text-yellow-500";
      case "HIGH": return "text-blue-500";
      default: return "text-green-500";
    }
  }

  useEffect(() => {
    // Reference to the readings for device SSTU234IX
    const readingsRef = ref(database, 'storagedata/SSTU234IX/readings');
    
    // Create a query to get only the latest reading
    const latestQuery = query(readingsRef, orderByKey(), limitToLast(1));
    
    const unsubscribe = onValue(latestQuery, (snapshot) => {
      const readingsData = snapshot.val();
      
      if (!readingsData) {
        console.log("No data found in Firebase");
        setIsLoading(false);
        return;
      }
      
      // Get the latest timestamp (the only key returned by limitToLast(1))
      const timestamps = Object.keys(readingsData);
      if (timestamps.length === 0) {
        setIsLoading(false);
        return;
      }
      
      const latestTimestamp = timestamps[0];
      const latestReading = readingsData[latestTimestamp];
      
      // Get the reading object (has Firebase push ID as key)
      const readingIds = Object.keys(latestReading);
      if (readingIds.length === 0) {
        setIsLoading(false);
        return;
      }
      
      const readingId = readingIds[0];
      const data = latestReading[readingId];
      
      console.log("Latest data from Firebase:", data);
      
      // Update sensor data with latest values
      const tempValue = data.temperature || 0;
      const humidityValue = data.humidity || 0;
      const weightValue = data.weight || 0;
      
      setTemperature(parseFloat(tempValue).toFixed(1));
      setHumidity(parseFloat(humidityValue).toFixed(1));
      setWeight(parseFloat(weightValue).toFixed(1)); // 3 decimal places for grams
      
      // Update status indicators
      setTempStatus(getTempStatus(tempValue));
      setHumidityStatus(getHumidityStatus(humidityValue));
      
      // Update actuator states (0/1 from database)
      setFan(data.fan || 0);
      setCooling(data.coolingstate || 0);
      setHumidifier(data.humidifier || 0);
      setDoorstate(data.doorstate || 0);
      
      // Stop loading
      setIsLoading(false);
    }, (error) => {
      console.error("Firebase read failed:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Convert weight from kg to grams for display (optional)
  const weightInGrams = (weight * 1000).toFixed(0);
  const weightPercentage = Math.min((weight / 0.05) * 100, 100); // Assuming 0-50g range
  const weightColor = weight >= 0.04 ? "bg-red-500" : 
                     weight >= 0.03 ? "bg-yellow-500" : 
                     "bg-green-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl p-6 mb-8 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 animate-gentle-pulse"/>
          <h1 className="relative text-3xl md:text-4xl font-bold text-white text-center">
            WELCOME BACK, nHUB @ 10!
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Storage Condition */}
          <div className="lg:col-span-2 space-y-6">
            {/* Storage Condition Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 bg-green-50 inline-block px-6 py-2 rounded-full">
                STORAGE CONDITION
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Temperature Card */}
                <div className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 ${statusColors[tempStatus].split(' ')[2]}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-700">TEMPERATURE</span>
                    <FaThermometerHalf className={`text-2xl ${getTempIconColor(tempStatus)}`} />
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-800 mb-2">
                      {temperature}°C
                    </div>
                    <div className={`inline-block px-4 py-2 rounded-full font-semibold ${statusColors[tempStatus]}`}>
                      {tempStatus}
                    </div>
                  </div>
                </div>

                {/* Humidity Card */}
                <div className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 ${statusColors[humidityStatus].split(' ')[2]}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-700">HUMIDITY</span>
                    <FaHumidity className={`text-2xl ${getHumidityIconColor(humidityStatus)}`} />
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-800 mb-2">
                      {humidity}%
                    </div>
                    <div className={`inline-block px-4 py-2 rounded-full font-semibold ${statusColors[humidityStatus]}`}>
                      {humidityStatus}
                    </div>
                  </div>
                </div>

                {/* Weight Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-700">WEIGHT</span>
                    <FaWeight className="text-2xl text-gray-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-800 mb-2">
                      {weight}kg
                      <div className="text-sm text-gray-500 mt-1">
                        ({weightInGrams}g)
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative pt-4">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full transition-all duration-500 ${weightColor}`}
                          style={{ width: `${weightPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>0kg</span>
                        <span className="font-semibold"/*>{weightInGrams}g<*/></span>
                        <span>50kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actuators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fan Card */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-700">FAN</span>
                  <FaFan className={`text-3xl ${getActuatorIconClass(fan)} ${fan === 0 ? "animate-spin" : ""}`} />
                </div>
                <div className={`text-4xl font-bold text-center py-8 rounded-2xl ${fan === 0 ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  {getActuatorStatus(fan)}
                </div>
              </div>

              {/* Cooling Card */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-700">COOLING</span>
                  <FaSnowflake className={`text-3xl ${getActuatorIconClass(cooling)} ${cooling === 0 ? "animate-pulse" : ""}`} />
                </div>
                <div className={`text-4xl font-bold text-center py-8 rounded-2xl ${cooling === 0 ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  {getActuatorStatus(cooling)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Controls and Product */}
          <div className="space-y-6">
            {/* Humidity Control Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">HUMIDIFIER</span>
                <FaTint className={`text-3xl ${getActuatorIconClass(humidifier)} ${humidifier === 0 ? "animate-bounce" : ""}`} />
              </div>
              <div className={`text-4xl font-bold text-center py-8 rounded-2xl ${humidifier === 0 ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                {getActuatorStatus(humidifier)}
              </div>
            </div>

            {/* Door Status Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">DOOR</span>
                {doorstate === 1 ? (
                  <FaDoorOpen className={`text-3xl ${getDoorIconClass(doorstate)}`} />
                ) : (
                  <FaDoorClosed className={`text-3xl ${getDoorIconClass(doorstate)}`} />
                )}
              </div>
              <div className={`text-4xl font-bold text-center py-8 rounded-2xl ${doorstate === 1 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                {getDoorStatus(doorstate)}
              </div>
            </div>

            {/* Product Image */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">YOUR PRODUCE</h3>
                <div className="relative">
                  <img 
                    src={Image} 
                    alt="Fresh produce" 
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">QUICK TIPS</h3>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                <p className="text-gray-700 leading-relaxed">
                  Make sure to maintain proper operation of this unit for maximum efficiency. 
                  Monitor temperature and humidity levels regularly. Ensure the door is properly 
                  sealed when not in use to conserve energy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interface;