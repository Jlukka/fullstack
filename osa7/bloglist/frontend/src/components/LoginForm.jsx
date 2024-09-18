import { useState } from "react";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (event) => {
    event.preventDefault();
    handleLogin({ username, password });

    setPassword("");
    setUsername("");
  };

  return (
    <div>
      <h2>log in</h2>
      <form onSubmit={login}>
        username{" "}
        <input
          type="text"
          value={username}
          placeholder="enter username"
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
        <br></br>
        password{" "}
        <input
          type="text"
          value={password}
          placeholder="enter password"
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <br></br>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
