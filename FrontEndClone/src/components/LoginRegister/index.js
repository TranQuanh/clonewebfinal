import './styles.scss';
import {useState} from "react";
import {API_BASE_URL} from "../../config";
function LoginRegister({onLoginSuccess}){
    const [registerMode, setRegisterMode] = useState(false);
    const [loginName, setLoginName] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [description, setDescription] = useState("");
    const [occupation, setOccupation] = useState("");
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registerError, setRegisterError] = useState("");

    const handleLogin = async(e) => {
        e.preventDefault();
        if(!loginName || !password){
            setError("Please enter login name and password");
            return;
        }
        setError("");
        try{
            const response = await fetch(`${API_BASE_URL}/api/user/admin/login`,
                {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        login_name: loginName,
                        password: password,
                    }),
                }
            );
            if(response.ok){
                const user = await response.json();
                onLoginSuccess(user);
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Login failed");
            }
        } catch(err) {
            console.error("Login error:", err);
            setError("Login failed. Please try again.");
        }
    }
    return (
        <div className="login-register-container">
            <div className="login-register-form">
                {registerMode ? (
                    <div className="login-box">
                        <h1>Register</h1>
                        <form>
                            <div className="form-group">
                                <div className="form-field full-width">
                                    <label>Login name:</label>
                                    <input
                                        type="text"
                                        value={loginName}
                                        onChange={(e) => setLoginName(e.target.value)}
                                        placeholder="Enter login name"
                                    />
                                </div>
                                <div className="form-field full-width">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter Password"
                                    />
                                </div>
                                <div className="form-field full-width">
                                    <label>Confirm Password:</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                    />
                                </div>

                                <div className="register-fields">
                                    <div className="form-field">
                                        <label>First name:</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Enter First Name"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Last name:</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Enter Last Name"
                                        />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Description:</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter Description"
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Occupation:</label>
                                    <input
                                        type="text"
                                        value={occupation}
                                        onChange={(e) => setOccupation(e.target.value)}
                                        placeholder="Enter Occupation"
                                    />
                                </div>
                            </div>
                            <div className="button-group">
                                <button type="submit">Register me</button>
                                <button type="button" onClick={() => setRegisterMode(false)}>
                                    Already have an account? Login
                                </button>
                            </div>
                        </form>
                        {registerError && <div className="error-message">{registerError}</div>}
                    </div>
                ) : (
                    <div className="login-box">
                        <h1>Login</h1>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <div className="form-field full-width">
                                    <label>Login name:</label>
                                    <input
                                        type="text"
                                        value={loginName}
                                        onChange={(e) => setLoginName(e.target.value)}
                                        placeholder="Enter login name"
                                    />
                                </div>
                                <div className="form-field full-width">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter Password"
                                    />
                                </div>
                            </div>
                            <div className="button-group">
                                <button type="submit">Login</button>
                                <button type="button" onClick={() => setRegisterMode(true)}>
                                    Register
                                </button>
                            </div>
                        </form>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginRegister;