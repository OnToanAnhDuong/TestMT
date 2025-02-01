export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { progressData } = req.body;

    if (!progressData) {
        return res.status(400).json({ error: "Missing progressData" });
    }

    try {
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_SAVE_PROGRESS_URL = "https://api.github.com/repos/OnToanAnhDuong/WEBMOi/contents/progress.json";

        const response = await fetch(GITHUB_SAVE_PROGRESS_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GITHUB_TOKEN}`,
            },
            body: JSON.stringify({
                message: "Cập nhật tiến trình học sinh",
                content: Buffer.from(JSON.stringify(progressData, null, 2)).toString("base64"),
            }),
        });

        if (!response.ok) {
            throw new Error("Lỗi khi lưu dữ liệu lên GitHub");
        }

        return res.status(200).json({ message: "Tiến trình đã được cập nhật!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
