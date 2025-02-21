import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 
import DashHead from '../reuse/header2';
import Sidebar2 from "../reuse/owner-side";

const HERE_API_KEY = "IsdHteQFPrCBYNhqR3ysAqq7pFPxBoBifUPCb39IrhQ"; // Replace with your actual HERE API Key

const requestQueue = [];
let isProcessing = false;

// Utility function to delay API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchLatLng = async (location) => {
  return new Promise((resolve) => {
    requestQueue.push({ location, resolve });
    if (!isProcessing) processQueue();
  });
};

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  isProcessing = true;

  while (requestQueue.length > 0) {
    const { location, resolve } = requestQueue.shift();
    try {
      const response = await axios.get(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(location)}&apiKey=${HERE_API_KEY}`
      );

      if (response.data.items.length > 0) {
        resolve(response.data.items[0].position);
      } else {
        resolve(null);
      }
    } catch (error) {
      console.error("Error fetching geolocation:", error);
      resolve(null);
    }

    await delay(500); // Delay of 500ms between requests
  }

  isProcessing = false;
};

const HereMap = () => {
  const mapRef = useRef(null);
  const [locations, setLocations] = useState({ users: [], playgrounds: [] });

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get("http://127.0.0.1:8000/api/locations/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then(async (response) => {
        const usersWithCoordinates = await Promise.all(
          response.data.users.map(async (user) => {
            if (user.location) {
              const coordinates = await fetchLatLng(user.location);
              return coordinates ? { ...user, ...coordinates } : null;
            }
            return null;
          })
        );

        setLocations({
          users: usersWithCoordinates.filter(Boolean), // Remove null values
          playgrounds: response.data.playgrounds,
        });
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []); // Empty dependency array means this effect runs once when the component mounts

  useEffect(() => {
    if (mapRef.current && window.H) {
      const platform = new window.H.service.Platform({ apikey: HERE_API_KEY });
      const defaultLayers = platform.createDefaultLayers({
        tileSize: 256,
        lg: "en",
      });

      const map = new window.H.Map(mapRef.current, defaultLayers.vector.normal.map, {
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        zoom: 5,
      });

      new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
      window.H.ui.UI.createDefault(map, defaultLayers);

      // Custom User and Playground Icons
      const userIcon = new window.H.map.Icon(
        `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="blue" stroke="black" stroke-width="2"/>
        </svg>`, 
        { anchor: { x: 12, y: 12 } }
      );

      const playgroundIcon = new window.H.map.Icon(
        `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" fill="green" stroke="black" stroke-width="2"/>
        </svg>`, 
        { anchor: { x: 12, y: 12 } }
      );

      // Add user markers
      locations.users.forEach((user) => {
        if (user.lat && user.lng) {
          const marker = new window.H.map.Marker(
            { lat: user.lat, lng: user.lng },
            { icon: userIcon }
          );
          marker.setData(`User: ${user.username}, Location: ${user.location}`);
          marker.addEventListener("tap", (event) => {
            alert(event.target.getData());
          });
          map.addObject(marker);
        }
      });

      // Add playground markers
      locations.playgrounds.forEach((playground) => {
        if (playground.latitude && playground.longitude) {
          const marker = new window.H.map.Marker(
            { lat: playground.latitude, lng: playground.longitude },
            { icon: playgroundIcon }
          );
          marker.setData(`Playground: ${playground.name}, Location: (${playground.location})`);
          marker.addEventListener("tap", (event) => {
            alert(event.target.getData());
          });
          map.addObject(marker);
        }
      });

      return () => map.dispose();
    }
  }, [locations]);

      const [userdetails, setUserDetails] = useState(null);
      useEffect(() => {
              const token = localStorage.getItem('authToken');
              if (!token) {
                  console.error("No token found, user is not logged in.");
                  return;
              }
          
              fetch('http://127.0.0.1:8000/api/settings/', {
                  method: 'GET',
                  headers: {
                  'Authorization': `Token ${token}`,
                  'Content-Type': 'application/json',
              },
              })
                  .then(response => response.json())
                  .then(data => {
                  setUserDetails(data);
                  })
                  .catch(error => {
                  console.error('Error fetching user data:', error);
              });
      }, []);

  return ( 
    <div>
      <div className='head-customer'>
          <DashHead/>
      </div>
      <div className='dashboard-container'>
      {userdetails && userdetails.user_type === 'Customer' ? <Sidebar /> : <Sidebar2 />}
          <div className='dashboard-content'>
            <h2>MAP</h2>
            <div style={{ height: "500px", width: "100%" }} ref={mapRef}></div>
          </div>
      </div> 
    </div>
  );
};

export default HereMap;
