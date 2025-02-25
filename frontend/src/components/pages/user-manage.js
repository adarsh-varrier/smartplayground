import React, { useEffect, useState } from "react";
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 

import DashHead from '../reuse/header2';
import Sidebar3 from '../reuse/admin-side';

function UserManagement() {
    const [adminUsers, setAdminUsers] = useState([]);  // State for admin users
    const [owners, setOwners] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://127.0.0.1:8000/api/users/", {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            const data = await response.json();
            
            setOwners(data.owners);  // Store owners separately
            setCustomers(data.customers);  // Store customers separately
            setAdminUsers(data.admin_users);  // Store admin users separately
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const deleteUser = async (userId, userType) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${token}`,
                },
            });
    
            if (response.status === 404) {
                alert("User not found or already deleted.");
                return;
            }
    
            if (response.ok) {
                // Remove from the correct list based on user type
                if (userType === "Owner") {
                    setOwners(owners.filter(user => user.id !== userId));
                } else {
                    setCustomers(customers.filter(user => user.id !== userId));
                }
                alert("User deleted successfully!");
            } else {
                alert("Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const deleteadmin = async (userId, isAdmin) => {
        try {
            const token = localStorage.getItem("authToken");
            let password = null;
    
            // If deleting an admin, prompt for password
            if (isAdmin) {
                password = prompt("Enter your password to delete this admin:");
                if (!password) {
                    alert("Password is required!");
                    return;
                }
            }
    
            const response = await fetch(`http://127.0.0.1:8000/api/users/admin/${userId}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }), // Send password in request
            });
    
            const data = await response.json();
    
            if (response.status === 403) {
                alert("Incorrect password! Admin deletion failed.");
                return;
            }
    
            if (response.ok) {
                alert("User deleted successfully!");
                setAdminUsers(adminUsers.filter(user => user.id !== userId)); // Remove admin from UI
            } else {
                alert(data.error || "Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
    
        const create_Admin = async (e) => {
            e.preventDefault();
            try {
                const token = localStorage.getItem("authToken");
                const response = await fetch("http://127.0.0.1:8000/api/create-admin/", {
                    method: "POST",
                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, email, password }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    alert("Admin created successfully!");
                    setUsername("");
                    setEmail("");
                    setPassword("");
                } else {
                    alert(data.error || "Failed to create admin.");
                }
            } catch (error) {
                console.error("Error creating admin:", error);
            }
        };
    
    
    

    return (
        <div>
            <div className='head-customer'>
                <DashHead />
            </div>
            <div className='dashboard-container'>
                <Sidebar3 />
                <div className='dashboard-content'>
                <h2 className="text-center my-4">User Management</h2>

<div className="container">
    <h3 className="mt-4">Owners</h3>
    <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Location</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {owners.map((owner) => (
                <tr key={owner.id}>
                    <td>{owner.id}</td>
                    <td>{owner.username}</td>
                    <td>{owner.email}</td>
                    <td>{owner.location}</td>
                    <td>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(owner.id)}>
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>

    <h3 className="mt-4">Customers</h3>
    <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Location</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {customers.map((customer) => (
                <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.username}</td>
                    <td>{customer.email}</td>
                    <td>{customer.location}</td>
                    <td>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(customer.id)}>
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>

    <h3 className="mt-4">Admins</h3>
    <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {adminUsers.map((user) => (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteadmin(user.id, true)}>
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>

    <div className="mt-5 p-4 border rounded shadow bg-light">
        <h2>Create New Admin</h2>
        <form onSubmit={create_Admin}>
            <div className="mb-3">
                <label className="form-label">Username:</label>
                <input 
                    type="text" 
                    className="form-control"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Email:</label>
                <input 
                    type="email" 
                    className="form-control"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Password:</label>
                <input 
                    type="password" 
                    className="form-control"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
            </div>

            <button type="submit" className="btn btn-primary w-100">Create Admin</button>
        </form>
    </div>
</div>

                </div>
            </div>
        </div>
    );
}

export default UserManagement;
