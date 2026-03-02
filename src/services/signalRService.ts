import { HubConnectionBuilder } from '@microsoft/signalr'

const HUB_URL = 'http://localhost:5063/pedidoHub'

export const useSignalR = () => {
  const createConnection = () => {
    return new HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build()
  }

  return { createConnection }
}
