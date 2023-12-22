import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (email && password) login(email, password);
    // after this login fn has been called, the isAuthenticated will change to true
  }

  // and when the isAuthenticated changes, the following effect runs
  // check whether `isAuthenticated === true`. If so, programatically navigate to `/app`
  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
      //🔴 without replace:true, when we are logged in in the app page and if we click on back it will go to the login page but will immediately go to the app page since we are logged in

      // so with replace:true, after loggin in, the login page is removed from the history stack and then when we click on the back btn we go to the home page
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
        <div>
          🔴 These are fake login credentials. Just click the login button to
          login.
          <br />
          The app would work with these credentials only!
        </div>
      </form>
    </main>
  );
}
