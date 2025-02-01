export default async function handler(req, res) {
    const { GITHUB_TOKEN, GITHUB_REPO_URL } = process.env;

    if (!GITHUB_TOKEN || !GITHUB_REPO_URL) {
        return res.status(500).json({ error: '❌ Thiếu biến môi trường trên Vercel' });
    }

    try {
        console.log("📥 Đang tải tiến trình từ GitHub...");

        const response = await fetch(GITHUB_REPO_URL, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const decodedContent = data?.content ? Buffer.from(data.content, 'base64').toString('utf-8') : "{}";
        res.status(200).json(JSON.parse(decodedContent));

    } catch (error) {
        console.error("❌ Lỗi khi tải tiến trình:", error);
        res.status(500).json({ error: error.message });
    }
}
