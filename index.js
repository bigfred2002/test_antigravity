const shutdownSignals = ['SIGINT', 'SIGTERM']

async function startPreview() {
    const { preview } = await import('vite')
    const port = Number(process.env.PORT) || 4173

    const server = await preview({
        preview: {
            host: '0.0.0.0',
            port,
        },
    })

    console.log(`Vite preview server lancé sur le port ${port}`)

    shutdownSignals.forEach((signal) => {
        process.on(signal, () => {
            server.httpServer.close(() => {
                process.exit(0)
            })
        })
    })
}

startPreview().catch((error) => {
    console.error('Impossible de démarrer le serveur Vite Preview', error)
    process.exit(1)
})
