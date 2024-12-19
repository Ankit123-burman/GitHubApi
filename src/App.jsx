import { useState } from "react";

function App() {
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState(null);
  const [rep, setRep] = useState([]);

  const userdata = async () => {
    if (!user) {
      alert("Please enter a GitHub username");
      return;
    }

    try {
      const userResponse = await fetch(`https://api.github.com/users/${user}`);
      if (!userResponse.ok) {
        throw new Error(userResponse.status === 404 ? "User not found!" : "Error occurred");
      }
      const userRep = await userResponse.json();
      setUserData(userRep);

      const reposResponse = await fetch(`https://api.github.com/users/${user}/repos`);
      if (!reposResponse.ok) {
        throw new Error("Error fetching repositories");
      }
      const repRes = await reposResponse.json();
      setRep(repRes);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error.message || "An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <h1 className="heading">Search GitHub User</h1>
      <input
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className="username"
        placeholder="Enter GitHub username"
      />
      <button onClick={userdata}>Search</button>

      {userData && (
        <div className="profile">
          <img src={userData.avatar_url} alt={userData.login} width="100" />
          <h2>{userData.name || "No name available"}</h2>
          <p>{userData.bio || "No bio available"}</p>
          <p>
            <strong>Followers:</strong> {userData.followers}
          </p>
          <p>
            <strong>Following:</strong> {userData.following}
          </p>
          <p>
            <strong>Location:</strong> {userData.location || "Not available"}
          </p>

          {rep.length > 0 && (
            <div className="repositories">
              <h3>Repositories:</h3>
              <ul>
                {rep.map((repo) => (
                  <li key={repo.id}>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      {repo.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;