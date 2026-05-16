export default async function handler(req, res) {
    const { id, stats } = req.query

    if (!id || !/^\d+$/.test(id)) {
        return res.status(400).json({ error: 'id is required and must be numeric' })
    }

    const token = process.env.BGG_API_TOKEN
    if (!token) {
        console.error('BGG_API_TOKEN environment variable is not set')
        return res.status(500).json({ error: 'Server configuration error' })
    }

    const bggUrl = `https://boardgamegeek.com/xmlapi2/thing?id=${id}${stats === '1' ? '&stats=1' : ''}`

    try {
        const response = await fetch(bggUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const text = await response.text()
        res.status(response.status).send(text)
    } catch (error) {
        console.error('Error fetching BGG thing:', error)
        res.status(502).json({ error: 'Failed to reach upstream API' })
    }
}
