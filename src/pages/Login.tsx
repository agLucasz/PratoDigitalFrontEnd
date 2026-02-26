import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/Login.css";
import { PiChefHatBold } from "react-icons/pi";
import { notify } from "../utils/notify";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(() => {
    try {
      const stored = localStorage.getItem("credenciaisLogin");
      if (!stored) return "";
      const parsed = JSON.parse(stored) as { email?: string };
      return parsed.email ?? "";
    } catch {
      return "";
    }
  });
  const [senha, setSenha] = useState(() => {
    try {
      const stored = localStorage.getItem("credenciaisLogin");
      if (!stored) return "";
      const parsed = JSON.parse(stored) as { senha?: string };
      return parsed.senha ?? "";
    } catch {
      return "";
    }
  });

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
      notify.error("Email ou senha inválidos");
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
