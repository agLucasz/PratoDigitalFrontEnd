import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrar } from "../services/authService";
import "../styles/Login.css";
import { PiChefHatBold } from "react-icons/pi";
import { notify } from "../utils/notify";

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await cadastrar({
        nome,
        email,
        senha,
        cargo
      });

      notify.success("Usuário cadastrado com sucesso!");
      navigate("/");

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      notify.error("Erro ao cadastrar usuário. Verifique os dados.");
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
            <span>Nome</span>
            <input 
              type="text" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </label>

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

          <label className="login-field">
            <span>Cargo</span>
            <select 
              value={cargo}
              onChange={(e) => setCargo(Number(e.target.value))}
            >
              <option value={1}>Administrador</option>
              <option value={2}>Garçom</option>
              <option value={3}>Cozinha</option>
              <option value={4}>Caixa</option>
            </select>
          </label>

          <button type="submit" className="login-submit">
            Cadastrar
          </button>

          <Link to="/" className="login-cadastro">
            Voltar para login
          </Link>
        </form>
      </section>
    </main>
  );
}

export default Cadastro;
