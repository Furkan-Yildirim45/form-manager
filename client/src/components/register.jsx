import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/login"); // Başarılı kayıt sonrası login sayfasına yönlendir
        } catch (error) {
            setError("Kayıt başarısız: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <h2>Admin Kayıt</h2>
            <form onSubmit={handleRegister}>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Yeni kullanıcı emailinizi girin"
                    />
                </label>
                <label>
                    Şifre:
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Şifrenizi girin"
                    />
                </label>
                <button type="submit">Kayıt Ol</button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
        </div>
    );
}

export default Register;
