import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/Login.css";
import { PiChefHatBold } from "react-icons/pi";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    const storedCreds = localStorage.getItem("credenciaisLogin");

    if (!storedCreds) return;

    try {
      const parsed = JSON.parse(storedCreds) as {
        email?: string;
        senha?: string;
      };

      if (parsed.email) {
        setEmail(parsed.email);
      }

      if (parsed.senha) {
        setSenha(parsed.senha);
      }
    } catch {
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login(email, senha);

      localStorage.setItem(
        "credenciaisLogin",
        JSON.stringify({ email, senha })
      );
      localStorage.setItem("token", response.token);
      localStorage.setItem("usuario", JSON.stringify(response));
      navigate("/dashboard");

    } catch (error) {
      console.error("Erro no login:", error);
      alert("Email ou senha inválidos");
    }
  };

  return (
    <main className="login">
      <section className="login-card">
        <div className="logo">
          <PiChefHatBold className="logo-icon" />
          <h1>Prato Digital</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Email</span>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="login-field">
            <span>Senha</span>
            <input 
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="login-submit">
            Entrar
          </button>

          <Link to="/cadastro" className="login-cadastro">
            Cadastre-se aqui
          </Link>
        </form>
      </section>
    </main>
  );
}

export default Login;
