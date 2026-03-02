import { useEffect, useState, useRef } from 'react'
import { useSignalR } from '../../services/signalRService'
import { finalizarPedido, listarPedidos, type Pedido } from '../../services/pedidoService'
import { HubConnection } from '@microsoft/signalr'
import '../../styles/Cozinha/Cozinha.css'

export default function CozinhaModule() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const connectionRef = useRef<HubConnection | null>(null)
  const { createConnection } = useSignalR()

  const handleFinalizar = async (pedidoId: number) => {
    try {
      await finalizarPedido(pedidoId)
      // Optimistic update or wait for signalR? 
      // SignalR "ReceberPedido" will likely remove it if we logic it right, 
      // but "ReceberPedido" sends the updated pedido.
      // If status is 3, we should remove it from the list.
    } catch (error) {
      console.error('Erro ao finalizar pedido', error)
    }
  }

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const [abertos, pendentes] = await Promise.all([
          listarPedidos(1),
          listarPedidos(2)
        ])
   
        const all = [...abertos, ...pendentes].sort((a, b) => 
          new Date(a.dataAbertura).getTime() - new Date(b.dataAbertura).getTime()
        )
        setPedidos(all)
      } catch (error) {
        console.error("Erro ao buscar pedidos", error)
      }
    }
    fetchPedidos()

    const connection = createConnection()

    connection.on('ReceberPedido', (pedido: Pedido) => {
      console.log('Pedido recebido:', pedido)
      setPedidos(prev => {
 
        if (pedido.status === 3 || pedido.status === 4) {
          return prev.filter(p => p.pedidoId !== pedido.pedidoId)
        }

 
        const index = prev.findIndex(p => p.pedidoId === pedido.pedidoId)
        if (index >= 0) {
          const newPedidos = [...prev]
          newPedidos[index] = pedido
          return newPedidos
        } else {
          return [...prev, pedido]
        }
      })
    })

    connection.start()
      .then(() => {
        console.log('SignalR Connected')
        connection.invoke('GrupoCozinha', 'cozinha')
      })
      .catch(err => console.error('SignalR Connection Error: ', err))

    connectionRef.current = connection

    return () => {
      connection.stop()
    }
  }, [])

  return (
    <main className="cozinha-dashboard">
      <h1>Cozinha</h1>
      <div className="cozinha-pedidos-grid">
        {pedidos.length === 0 ? (
          <p className="no-pedidos">Nenhum pedido pendente.</p>
        ) : (
          pedidos.map(pedido => (
            <div key={pedido.pedidoId} className="cozinha-pedido-card">
              <div className="cozinha-card-header">
                <h2>Mesa {pedido.mesa}</h2>
                <span className="cozinha-pedido-id">#{pedido.pedidoId}</span>
              </div>
              <div className="cozinha-card-body">
                {(!pedido.itens || pedido.itens.length === 0) ? (
                  <p className="sem-itens">Sem itens</p>
                ) : (
                  <ul>
                    {pedido.itens.map(item => (
                      <li key={item.pedidoItemId}>
                        <div className="item-main">
                          <span className="quantidade">{item.quantidade}</span>
                          <span className="produto-nome">{item.produto?.nomeProduto || 'Produto'}</span>
                        </div>
                        {item.pedidoObservacao && (
                          <p className="obs">⚠️ {item.pedidoObservacao}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="cozinha-card-footer">
                <button 
                  className="btn-finalizar"
                  onClick={() => handleFinalizar(pedido.pedidoId)}
                >
                  Finalizar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
