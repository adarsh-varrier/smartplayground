import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";  // Import useParams to get the playgroundId

const BookingForm = () => {
  const { playgroundId } = useParams();  // Retrieve the playgroundId from the URL
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [numPlayers, setNumPlayers] = useState(1);
  const [availableSlots, setAvailableSlots] = useState({
    morning: [],
    afternoon: [],
    evening: [],
    night: []
  });

  // Debugging: Check if playgroundId is available
  useEffect(() => {
    console.log("playgroundId:", playgroundId); // Check the playgroundId in the console
    console.log("date:", date);
    if (!date || !playgroundId) return;  // Make sure both date and playgroundId are available

    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/playgrounds/${playgroundId}/available-slots/`,
          { params: { date } }
        );
        setAvailableSlots(response.data.available_slots);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, [date, playgroundId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/playgrounds/${playgroundId}/book/`,
        { date, time_slot: timeSlot, num_players: numPlayers },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleBooking}>
      {/* Date Picker */}
      <label>Date:</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

      {/* Time Slot Selection */}
      <label>Time Slot:</label>
      <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required>
        <option value="">Select a slot</option>
        
        {/* Morning Section */}
        {availableSlots.morning.length > 0 && <optgroup label="Morning">
          {availableSlots.morning.map((slot, index) => (
            <option key={`morning-${index}`} value={slot[0]}>
              {slot[0]} - {slot[1]}
            </option>
          ))}
        </optgroup>}
        
        {/* Afternoon Section */}
        {availableSlots.afternoon.length > 0 && <optgroup label="Afternoon">
          {availableSlots.afternoon.map((slot, index) => (
            <option key={`afternoon-${index}`} value={slot[0]}>
              {slot[0]} - {slot[1]}
            </option>
          ))}
        </optgroup>}
        
        {/* Evening Section */}
        {availableSlots.evening.length > 0 && <optgroup label="Evening">
          {availableSlots.evening.map((slot, index) => (
            <option key={`evening-${index}`} value={slot[0]}>
              {slot[0]} - {slot[1]}
            </option>
          ))}
        </optgroup>}
        
        {/* Night Section */}
        {availableSlots.night.length > 0 && <optgroup label="Night">
          {availableSlots.night.map((slot, index) => (
            <option key={`night-${index}`} value={slot[0]}>
              {slot[0]} - {slot[1]}
            </option>
          ))}
        </optgroup>}
      </select>

      {/* Number of Players */}
      <label>Number of Players:</label>
      <input type="number" min="1" max="10" value={numPlayers} onChange={(e) => setNumPlayers(e.target.value)} required />

      {/* Submit Button */}
      <button type="submit">Book Now</button>
    </form>
  );
};

export default BookingForm;
