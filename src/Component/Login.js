import { useState } from "react";
import { apiPost } from "../services.js";
import { Avatar, Button, Grid, Paper, TextField } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = () => {
  const [inputs, setInputs] = useState({});
  const paperStyle = {
    padding: 20,
    height: "400px",
    width: 360,
    margin: "30px auto",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e", margin: "10px" };
  const btnstyle = { margin: "20px 0" };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    apiPost("login", inputs)
      .then((res) => {
        console.log(res);
        console.log("token", res.data.token.token);
        localStorage.setItem("react-project-token", res.data.token.token);

        localStorage.setItem(
          "react-project-user",
          JSON.stringify(res.data.user)
        );

        // handleSuccess("Log in successfully");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign in</h2>
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField
            onChange={(e) => handleChange(e)}
            name="email"
            id="Email"
            label="Email-Address"
            placeholder="Enter username"
            autoComplete="email"
            fullWidth
            required
            sx={{ paddingTop: 1, paddingBottom: 3 }}
          />
          <TextField
            onChange={(e) => handleChange(e)}
            name="password"
            id="password"
            label="Password"
            autoComplete="current-password"
            placeholder="Enter password"
            type="password"
            fullWidth
            required
            sx={{ paddingTop: 1, paddingBottom: 3 }}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={btnstyle}
            fullWidth
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};
export default Login;
