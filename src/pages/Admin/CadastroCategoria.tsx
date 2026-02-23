import '../../styles/Admin/Categoria.css'
import { cadastrar } from '../../services/categoriaService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MdCategory, MdArrowBack, MdSave } from 'react-icons/md';

function CadastroCategoria() {
  const navigate = useNavigate();
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await cadastrar({
        nomeCategoria,
      });

      alert("Categoria cadastrada com sucesso!");
      navigate("/admin/categoria"); // Assuming this is the path, or just go back

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="categoria-section">
      <div className="categoria-container">
        <button className="categoria-back-button" onClick={() => navigate(-1)}>
          <MdArrowBack /> Voltar
        </button>

        <div className="categoria-header">
          <h2>Cadastrar Categoria</h2>
          <p>Adicione uma nova categoria ao cardápio</p>
        </div>

        <form className="categoria-form" onSubmit={handleSubmit}>
          <label className="categoria-field">
            <span>Nome da Categoria</span>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={nomeCategoria}
                onChange={(e) => setNomeCategoria(e.target.value)}
                required
                placeholder="Ex: Bebidas, Lanches..."
                style={{ paddingLeft: '2.5rem' }}
              />
              <MdCategory style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            </div>
          </label>
          <button type="submit" className="categoria-submit" disabled={loading}>
            {loading ? 'Salvando...' : (
              <>
                <MdSave /> Cadastrar
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}

export default CadastroCategoria
