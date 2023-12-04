import "./App.css";
import SearchAppBar from "./Component/SearchAppBar";
import ProdTable from "./Component/ProdTable";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Component/Login";

function App() {
  const [searchKeyWord, setSearchKeyWord] = useState("");

  const auth = localStorage.getItem("react-project-token");
  let user = auth ? JSON.parse(localStorage.getItem("react-project-user")) : {};

  const logout = () => {
    localStorage.removeItem("react-project-token");
    localStorage.removeItem("react-project-user");
    window.location.reload();
  };
  return (
    <Router>
      <div className="App">
        <SearchAppBar
          keyWord={searchKeyWord}
          onSearch={setSearchKeyWord}
          logout={logout}
          user={user}
        />
        <Routes>
          <Route
            path="/"
            element={
              auth ? (
                <ProdTable keyWord={searchKeyWord} />
              ) : (
                <Navigate to="/login" />
              )
            }
          ></Route>
          <Route
            path="/login"
            element={auth ? <Navigate to="/" /> : <Login />}
          ></Route>
          <Route path="*" element={<Navigate to={{ pathname: "/" }} />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
