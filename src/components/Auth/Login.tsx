import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import { AUTH_TOKEN } from "../../constants";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

function saveUserData(token: string) {
  localStorage.setItem(AUTH_TOKEN, token);
}

function useAuth(
  loggedIn: boolean,
  email: string,
  password: string,
  name: string
) {
  const [login] = useMutation(LOGIN_MUTATION);
  const [signup] = useMutation(SIGNUP_MUTATION);

  const history = useHistory();

  async function authenticate() {
    let token: string;

    if (loggedIn) {
      const { data } = await login({ variables: { email, password } });
      token = data.login.token;
    } else {
      const { data } = await signup({ variables: { email, password, name } });
      token = data.signup.token;
    }

    saveUserData(token);
    history.push(`/`);
  }

  return authenticate;
}

const Login = () => {
  const [loggedIn, setLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const authenticate = useAuth(loggedIn, email, password, name);

  return (
    <div>
      <h4 className="mv3">{loggedIn ? "Login" : "Sign Up"}</h4>

      <div className="flex flex-column">
        {!loggedIn && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Your name"
          />
        )}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Your email address"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>

      <div className="flex mt3">
        <div className="pointer mr2 button" onClick={authenticate}>
          {loggedIn ? "login" : "create account"}
        </div>

        <div className="pointer button" onClick={() => setLogin(!loggedIn)}>
          {loggedIn ? "need to create an account?" : "already have an account?"}
        </div>
      </div>
    </div>
  );
};

export default Login;
