const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_9be10771625e`
const connectUrl = `mqtt://${host}:${port}`
const connectUrl2 = `mqtt://localhost`
export const mqttConfig =  {
    clientId,
    clean: false,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
}