import '../../styles/Admin/FormaPagamento.css'
import { cadastrar } from '../../services/formaPagamentoService'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MdPayment, MdArrowBack, MdSave } from 'react-icons/md';

function CadastrarFormaPagamento(){
  const navigate = useNavigate();
  const [descricaoPagamento, setDescricaoPagamento] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await cadastrar({
        descricaoPagamento,
      });

      alert("Forma de Pagamento cadastrada com sucesso!");
      navigate("/admin/formapagamento"); // Adjust path if needed

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar forma de pagamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="formapagamento-section">
      <div className="formapagamento-container">
        <button className="formapagamento-back-button" onClick={() => navigate(-1)}>
          <MdArrowBack /> Voltar
        </button>

        <div className="formapagamento-header">
          <h2>Cadastrar Forma de Pagamento</h2>
          <p>Adicione uma nova opção de pagamento</p>
        </div>

        <form className="formapagamento-form" onSubmit={handleSubmit}>
          <label className="formapagamento-field">
            <span>Forma de Pagamento</span>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={descricaoPagamento}
                onChange={(e) => setDescricaoPagamento(e.target.value)}
                required
                placeholder="Ex: Cartão de Crédito, Pix..."
                style={{ paddingLeft: '2.5rem' }}
              />
              <MdPayment style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            </div>
          </label>
          <button type="submit" className="formapagamento-submit" disabled={loading}>
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
export default CadastrarFormaPagamento


