import { useState, useEffect } from "react";

export default function Home() {
    const [progressData, setProgressData] = useState({});
    const [loading, setLoading] = useState(true);
    const [studentId, setStudentId] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    // 🟢 Lấy tiến trình từ GitHub khi load trang
    useEffect(() => {
        fetch("/api/get-progress")
            .then(res => res.json())
            .then(data => {
                setProgressData(data);
                setLoading(false);
                console.log("✅ Tiến trình tải thành công:", data);
            })
            .catch(err => {
                console.error("❌ Lỗi tải tiến trình:", err);
                setLoading(false);
            });
    }, []);

    // 🟢 Hàm cập nhật tiến trình và lưu lên GitHub
    const updateProgress = async (problemId) => {
        const updatedProgress = { ...progressData, [problemId]: !progressData[problemId] };
        setProgressData(updatedProgress);

        try {
            const response = await fetch("/api/save-progress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ progressData: updatedProgress }),
            });

            const result = await response.json();
            console.log("✅ Server response:", result);
            alert("Tiến trình đã được cập nhật!");
        } catch (error) {
            console.error("❌ Lỗi khi lưu tiến trình:", error);
            alert("Lỗi khi lưu tiến trình!");
        }
    };

    // 🟢 Xử lý đăng nhập
    const handleLogin = () => {
        if (studentId.trim() !== "") {
            setLoggedIn(true);
            alert(`Xin chào, học sinh ${studentId}!`);
        } else {
            alert("Vui lòng nhập mã học sinh!");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>ÔN LUYỆN TOÁN THCS - TRUNG TÂM ÁNH DƯƠNG</h1>

            {!loggedIn ? (
                <div>
                    <input
                        type="text"
                        placeholder="Nhập mã học sinh"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        style={{ padding: "10px", marginRight: "10px" }}
                    />
                    <button onClick={handleLogin} style={{ padding: "10px 20px" }}>Đăng nhập</button>
                </div>
            ) : (
                <div>
                    <h2>Danh sách bài tập</h2>
                    {loading ? <p>Đang tải...</p> : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                            {Object.keys(progressData).map((problemId) => (
                                <button
                                    key={problemId}
                                    onClick={() => updateProgress(problemId)}
                                    style={{
                                        padding: "10px",
                                        minWidth: "80px",
                                        backgroundColor: progressData[problemId] ? "green" : "yellow",
                                        color: "#fff",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    {`Bài ${problemId}`}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
