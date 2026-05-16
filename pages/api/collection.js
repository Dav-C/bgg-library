export default async function handler(req, res) {
    const { username } = req.query

    if (!username || typeof username !== 'string' || username.trim() === '') {
        return res.status(400).json({ error: 'username is required' })
    }

    const token = process.env.BGG_API_TOKEN
    if (!token) {
        console.error('BGG_API_TOKEN environment variable is not set')
        return res.status(500).json({ error: 'Server configuration error' })
    }

    // Sanitize username: BGG usernames are alphanumeric with underscores/hyphens
    const safeUsername = encodeURIComponent(username.trim())

const bggUrl = `https://boardgamegeek.com/xmlapi2/collection?username=${safeUsername}`

    try {
        const response = await fetch(bggUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        // Forward the status code and body back to the client
        const text = await response.text()
        res.status(response.status).send(text)
    } catch (error) {
        console.error('Error fetching BGG collection:', error)
        res.status(502).json({ error: 'Failed to reach upstream API' })
    }
}
