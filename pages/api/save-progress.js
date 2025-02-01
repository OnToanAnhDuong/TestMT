export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { progressData } = req.body;
    if (!progressData) {
        return res.status(400).json({ error: '❌ Thiếu dữ liệu tiến trình' });
    }

    const { GITHUB_TOKEN, GITHUB_REPO_URL } = process.env;

    if (!GITHUB_TOKEN || !GITHUB_REPO_URL) {
        return res.status(500).json({ error: '❌ Thiếu biến môi trường trên Vercel' });
    }

    try {
        console.log("📥 Đang lấy SHA của file JSON...");

        let sha = null;
        const shaResponse = await fetch(GITHUB_REPO_URL, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${GITHUB_TOKEN}`
            }
        });

        if (shaResponse.ok) {
            const shaData = await shaResponse.json();
            sha = shaData.sha || null;
            console.log("✅ SHA lấy được:", sha);
        } else if (shaResponse.status === 404) {
            console.warn("⚠ File chưa tồn tại, sẽ tạo mới.");
        } else {
            throw new Error("❌ Lỗi khi lấy SHA file từ GitHub.");
        }

        console.log("📤 Đang lưu tiến trình lên GitHub...");
        const content = Buffer.from(JSON.stringify(progressData, null, 2)).toString('base64');

        const response = await fetch(GITHUB_REPO_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GITHUB_TOKEN}`
            },
            body: JSON.stringify({
                message: 'Cập nhật tiến trình học sinh',
                content: content,
                ...(sha ? { sha } : {})
            })
        });

        if (!response.ok) {
            throw new Error(`❌ Lỗi khi lưu tiến trình: ${response.statusText}`);
        }

        console.log("✅ Tiến trình đã được lưu lên GitHub!");
        res.status(200).json({ message: "Tiến trình đã được lưu" });

    } catch (error) {
        console.error("❌ Lỗi khi lưu tiến trình:", error);
        res.status(500).json({ error: error.message });
    }
}
