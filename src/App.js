import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Protected from './components/Protected';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
      <Router>
        <div className="min-vh-100 bg-light">
          <nav className="navbar navbar-expand-lg navbar-dark bg-black mb-4">
            <div className="container">
              <Link className="navbar-brand" to="/">Practice 5</Link>
              <div>
                {!token ? (
                    <>
                      <Link className="btn btn-dark" to="/login">Login</Link>
                      <Link className="btn btn-dark" to="/register">Register</Link>
                    </>
                ) : (
                    <>
                      <Link className="btn btn-dark" to="/protected">Protected Page</Link>
                      <button
                          onClick={handleLogout}
                          className="btn btn-dark text-danger"
                      >
                        Logout
                      </button>
                    </>
                )}
              </div>
            </div>
          </nav>

          <div className="container">
            <Routes>
              <Route path="/login" element={<Login setToken={setToken} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/protected" element={<Protected token={token} />} />
              <Route path="/" element={
                <div className="text-center mt-5">
                  <h2 className="mb-3">Welcome to practice 5</h2>
                  <p>Please login or register to continue.</p>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
