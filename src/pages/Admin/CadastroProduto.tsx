import '../../styles/Admin/Produto.css'
import { cadastrar } from '../../services/produtoService';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listarCategorias, type Categoria } from '../../services/categoriaService';
import { 
  MdArrowBack, 
  MdSave
} from 'react-icons/md';
import { notify } from '../../utils/notify';

function CadastroProduto() {
  const navigate = useNavigate();
  const [nomeProduto, setNomeProduto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoProduto, setPrecoProduto] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      setCarregandoCategorias(true);
      try {
        const data = await listarCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        notify.error('Não foi possível carregar as categorias.');
      } finally {
        setCarregandoCategorias(false);
      }
    };

    carregar();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (categoriaId === '') {
      notify.warning('Selecione uma categoria');
      return;
    }

    setLoading(true);
    try {
      await cadastrar({
        nomeProduto,
        descricao,
        precoProduto: Number(precoProduto),
        categoriaId,
      });

      // Feedback visual antes de navegar
      notify.success("Produto cadastrado com sucesso!");
      navigate("/");

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      notify.error("Erro ao cadastrar produto. Verifique os dados.");
      setLoading(false);
    }
  };

  return (
    <section className="produto-section">
      <div className="produto-container produto-container--compact">
        <button className="produto-back-button" onClick={() => navigate(-1)}>
          <MdArrowBack /> Voltar
        </button>

        <div className="produto-header">
          <h2>Cadastrar Produto</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Adicione um novo item ao cardápio</p>
        </div>

        <form className="produto-form" onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label className="produto-field">
              <span>Nome do Produto</span>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  required
                  placeholder="Ex: X-Bacon"
                />
              </div>
            </label>

            <label className="produto-field">
              <span>Preço (R$)</span>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number"
                  step="0.01"
                  value={precoProduto}
                  onChange={(e) => setPrecoProduto(e.target.value)}
                  required
                  placeholder="0.00"
                />
              </div>
            </label>
          </div>

          <label className="produto-field produto-field--categoria" style={{ marginTop: '1rem' }}>
            <span>Categoria</span>
            <div style={{ position: 'relative' }}>
              <select 
                value={categoriaId}
                onChange={(e) => {
                  const value = e.target.value;
                  setCategoriaId(value === '' ? '' : Number(value));
                }}
                disabled={carregandoCategorias}
              >
                <option value="">
                  {carregandoCategorias ? 'Carregando...' : 'Selecione uma categoria'}
                </option>
                {categorias.map((categoria) => (
                  <option key={categoria.categoriaId} value={categoria.categoriaId}>
                    {categoria.nomeCategoria}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="produto-field produto-field--descricao" style={{ marginTop: '1rem' }}>
            <span>Descrição</span>
            <div style={{ position: 'relative' }}>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                placeholder="Detalhes do prato..."
                style={{ minHeight: '80px' }}
                rows={3}
              />
            </div>
          </label>

          <button type="submit" className="produto-submit" disabled={loading} style={{ marginTop: '1.5rem' }}>
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

export default CadastroProduto
