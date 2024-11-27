import  { useState, useEffect } from "react";
import Users from "./Components/Users";
import UserDetails from "./Components/UserDetails";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      setUsers(response.data);
      toast.success("Users fetched successfully!");
    } catch (error) {
      toast.error("Error fetching users.");
      console.error("Error fetching users:", error);
    }
  };

  const addUser = async (user) => {
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/users", user);
      setUsers([...users, response.data]);
      setIsAdding(false);
      toast.success("User added successfully!");
    } catch (error) {
      toast.error("Error adding user.");
      console.error("Error adding user:", error);
    }
  };

  const updateUser = async (user) => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${user.id}`, user);
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
      setEditingUser(null);
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error("Error updating user.");
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Error deleting user.");
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      {isAdding || editingUser ? (
        <UserDetails
          initialData={editingUser}
          onSave={editingUser ? updateUser : addUser}
        />
      ) : (
        <div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Add User
          </button>
          <Users
            users={users}
            fetchUsers={fetchUsers}
            onEdit={(user) => setEditingUser(user)}
            onDelete={deleteUser}
          />
        </div>
      )}
    </div>
  );
};

export default App;
