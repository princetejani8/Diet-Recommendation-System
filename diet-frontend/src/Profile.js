import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: '',
    BMI: '',
    food_preference: '',
    calories: '',
    password: ''
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/get-profile/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setProfileData(data.profile);
            setUpdatedData(data.profile);
          } else {
            setError(data.message);
          }
        })
        .catch((err) => setError('Failed to fetch profile data'));
    } else {
      setError('User not logged in.');
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, BMI, food_preference, calories, password } = updatedData;
    
    // Send updated data to the backend
    fetch(`http://localhost:5000/update-profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, BMI, food_preference, password, calories }),  // Include password
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProfileData(updatedData); // Update profile in state
          setEditMode(false); // Disable editing mode
        } else {
          setError(data.message);
        }
      })
      .catch((err) => setError('Failed to update profile'));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      style={{
        fontFamily: 'Montserrat, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'url("/path/to/your/background-image.jpg") no-repeat center center fixed',
        backgroundSize: 'cover',
        color: '#fff', // White text color for dark theme
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(44, 44, 44, 0.7)', // Dark background with transparency for the profile container
          padding: '20px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          border: '1px solid #444', // Dark border for profile container
          textAlign: 'center', // Center the profile text
        }}
      >
        <h1 style={{ marginBottom: '20px', fontWeight: "400" }}>Profile</h1>
        {profileData ? (
          <div>
            <div className="profile-info-item" style={{ marginBottom: '15px' }}>
              <strong>Name</strong>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={updatedData.name}
                  onChange={handleInputChange}
                  style={{
                    padding: '8px',
                    width: '100%',
                    marginTop: '5px',
                    backgroundColor: '#333', // Dark input background
                    color: '#fff', // White text for dark theme
                    border: '1px solid #555',
                  }}
                />
              ) : (
                <span>{profileData.name}</span>
              )}
            </div>
            <div className="profile-info-item" style={{ marginBottom: '15px' }}>
              <strong>BMI</strong>
              {editMode ? (
                <input
                  type="text"
                  name="BMI"
                  value={updatedData.BMI}
                  onChange={handleInputChange}
                  style={{
                    padding: '8px',
                    width: '100%',
                    marginTop: '5px',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                  }}
                />
              ) : (
                <span>{profileData.BMI}</span>
              )}
            </div>
            <div className="profile-info-item" style={{ marginBottom: '15px' }}>
              <strong>Food Preference</strong>
              {editMode ? (
                <input
                  type="text"
                  name="food_preference"
                  value={updatedData.food_preference}
                  onChange={handleInputChange}
                  style={{
                    padding: '8px',
                    width: '100%',
                    marginTop: '5px',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                  }}
                />
              ) : (
                <span>{profileData.food_preference}</span>
              )}
            </div>
            <div className="profile-info-item" style={{ marginBottom: '15px' }}>
              <strong>Password</strong>
              {editMode ? (
                <input
                  type="password"
                  name="password"
                  value={updatedData.password}
                  onChange={handleInputChange}
                  style={{
                    padding: '8px',
                    width: '100%',
                    marginTop: '5px',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                  }}
                />
              ) : (
                <span>⏺⏺⏺</span> // Mask the password
              )}
            </div>

            {editMode ? (
              <button
                onClick={handleSubmit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '20px',
                }}
              >
                Update Profile
              </button>
            ) : (
              <button
                onClick={handleEdit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '20px',
                }}
              >
                Edit Profile
              </button>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
