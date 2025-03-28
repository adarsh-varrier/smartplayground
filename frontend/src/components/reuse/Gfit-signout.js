import React from 'react';

const GfitSignOut = () => { 

  const handleSignOut = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://127.0.0.1:8000/api/google-fit/sign-out/", {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`, // Ensure the user is authenticated
                "Content-Type": "application/json",
            },
        });

      const data = await response.json();
      alert(data.message);

      if (data.status === "success") {
        localStorage.removeItem("userToken"); // Remove token if needed
        window.location.reload(); // Refresh to apply changes
      }
    } catch (error) {
      alert("Error signing out");
    }
  };

  return (
    <div>
      <p>Sign out from Google Fit</p>
      <button onClick={handleSignOut} style={{ padding: "10px", background: "red", color: "white", border: "none", cursor: "pointer" }}>
        Sign Out
      </button>
    </div>
  );
};

export default GfitSignOut;
