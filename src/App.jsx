import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { db } from './firebase-config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';

/**
 * Renders the main application component.
 * @function
 * @returns {JSX.Element} - The rendered component.
 */
/**
 * Renders a component that allows users to create, read, update, and delete user data from a Firestore database.
 * @function
 * @returns {JSX.Element} - A JSX element representing the App component.
 */
function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(0);

  /**
   * Reference to the 'users' collection in Firestore database.
   * @type {import('firebase/firestore').CollectionReference<import('./types').User>}
   */
  const usersCollectionRef = collection(db, 'users');

  /**
   * Fetches users data from Firestore and sets it to the state.
   * @function
   * @async
   * @name getUsers
   * @returns {Promise<void>}
   */
  const getUsers = useCallback(async () => {
    const data = await getDocs(usersCollectionRef);
    console.log(data);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); //use spread operator to return all fields from data
  }, [usersCollectionRef]);

  /**
   * Creates a new user with the given name and age, and adds it to the users collection in Firestore.
   * @async
   * @function
   * @name createUser
   * @returns {Promise<void>}
   */
  const createUser = async () => {
    await addDoc(usersCollectionRef, { name: newName, age: Number(newAge) });
    getUsers();
  };

  /**
   * Updates the age of a user in the Firestore database.
   * @function
   * @async
   * @name updateUser
   * @param {string} id - The ID of the user to update.
   * @param {number} age - The current age of the user.
   * @returns {Promise<void>} - A Promise that resolves when the update is complete.
   */
  const updateUser = async (id, age) => {
    const userDoc = doc(db, 'users', id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
    getUsers();
  };

  /**
   * Deletes a user with the given ID from the Firestore database.
   * @function
   * @async
   * @name deleteUser
   * @param {string} id - The ID of the user to be deleted.
   * @returns {Promise<void>} A Promise that resolves when the user is deleted.
   */
  const deleteUser = async (id) => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
    getUsers();
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="App">
      <input
        placeholder="Name..."
        onChange={(event) => {
          setNewName(event.target.value);
        }}
      />
      <input
        type="number"
        placeholder="Age..."
        onChange={(event) => {
          setNewAge(event.target.value);
        }}
      />
      <button onClick={createUser}> Create User</button>

      {users.map((user) => {
        return (
          <div key={user.id}>
            <h1> Name: {user.name} </h1>
            <h1> Age: {user.age} </h1>
            <button
              onClick={() => {
                updateUser(user.id, user.age);
              }}
            >
              Increase Age
            </button>
            <button
              onClick={() => {
                deleteUser(user.id);
              }}
            >
              Delete User
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
