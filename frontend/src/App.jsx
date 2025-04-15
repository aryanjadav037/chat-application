import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/api/auth/validate", {
            withCredentials: true
        })
        .then(res => setUser(res.data.user))
        .catch(err => console.error("Auth failed:", err));
    }, []);

    const handleLogout = () => {
        axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true })
            .then(() => window.location.href = "/")
            .catch(console.error);
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1>Welcome, {user.username}</h1>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;