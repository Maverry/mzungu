import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => setUser(user));
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      const querySnapshot = await getDocs(collection(db, "profiles"));
      setProfiles(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProfiles();
  }, []);

  const logout = () => signOut(auth);

  return (
    <div className="app">
      <h1>MzungusDate</h1>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>
          <div className="cardContainer">
            {profiles.map((profile) => (
              <TinderCard
                key={profile.id}
                onSwipe={(dir) => console.log("You swiped: " + dir)}
              >
                <div
                  className="card"
                  style={{ backgroundImage: `url(${profile.photoURL})` }}
                >
                  <h3>{profile.name}, {profile.age}</h3>
                </div>
              </TinderCard>
            ))}
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => auth.signInWithEmailAndPassword(email, password);
  const register = () => auth.createUserWithEmailAndPassword(email, password);

  return (
    <div className="login">
      <h2>Login to MzungusDate</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
      <button onClick={register}>Register</button>
    </div>
  );
}

export default App;