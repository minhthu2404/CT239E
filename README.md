SpendWise - Hệ thống Quản lý chi tiêu cá nhân
Niên luận cơ sở ngành - CT239E

Giới thiệu
SpendWise là một ứng dụng Web hỗ trợ quản lý chi tiêu cá nhân, giúp người dùng theo dõi thu nhập, chi tiêu, thiết lập ngân sách và phân tích tài chính một cách trực quan.
    Điểm nổi bật của hệ thống là tích hợp Trí tuệ nhân tạo (AI) nhằm:
        Cho phép nhập liệu bằng ngôn ngữ tự nhiên
        Cung cấp tư vấn tài chính cá nhân hóa thông qua chatbot

Mục tiêu đề tài
    Xây dựng hệ thống quản lý chi tiêu cá nhân hoàn chỉnh
    Áp dụng kiến trúc Client–Server và mô hình MVC
    Tích hợp AI (LLM) vào bài toán thực tế
    Tối ưu trải nghiệm người dùng với giao diện đơn giản, dễ dùng

Công nghệ sử dụng
    Client-side:
        HTML, CSS, JavaScript thuần
        Không sử dụng framework/library bên ngoài
    Server-side:
        Node.js + Express.js
        MongoDB (database)
        Ollama (AI inference engine)

Cấu trúc dự án
CT239E/
├── client/                     # Frontend
│   ├── welcome_page/           # Đăng nhập / Đăng ký
│   ├── overview_page/          # Dashboard
│   ├── transaction_page/       # Quản lý giao dịch
│   ├── budget_page/            # Ngân sách
│   ├── report_page/            # Báo cáo
│   └── chatbot/                # Giao diện AI chatbot
│
└── server/                     # Backend
    ├── models/                 # Schema (User, Transaction, Budget)
    ├── controllers/            # Xử lý logic chính
    ├── routes/                 # Định nghĩa API
    ├── services/               # Xử lý AI (Ollama)
    ├── utils/                  # Hàm tiện ích
    └── server.js               # Entry point


Các tính năng chính
1. Quản lý tài khoản
    Đăng ký / Đăng nhập
    Xác thực JWT
    Quản lý thông tin cá nhân
2. Quản lý giao dịch
    Thêm, sửa, xóa giao dịch
    Phân loại thu/chi
    Lọc theo ngày, tháng, năm
    Tìm kiếm giao dịch
3. Quản lý ngân sách
    Thiết lập ngân sách theo tháng
    Theo dõi tiến độ ngân sách
    Cảnh báo khi vượt ngân sách
4. Báo cáo và phân tích
    Báo cáo tổng quan
    Biểu đồ trực quan
    Báo cáo theo thời gian
5. Tích hợp AI
    Nhập liệu bằng ngôn ngữ tự nhiên
    Phân tích giao dịch tự động
    Chatbot tư vấn tài chính

Hướng dẫn sử dụng
1. Cài đặt
    Clone repository:
    git clone <repository-url>
    cd CT239E
2. Cài đặt dependencies
    cd server
    npm install
3. Khởi động server
    npm start
    Server sẽ chạy tại http://localhost:3000
4. Truy cập ứng dụng
    Mở http://localhost:3000 trong trình duyệt
    Đăng ký tài khoản mới hoặc đăng nhập
    Sử dụng các tính năng của ứng dụng

Cấu hình AI
    Đảm bảo Ollama đã được cài đặt và chạy
    Model mặc định: llama3.1:8b
    Có thể cấu hình model trong server/services/ollamaService.js

Cấu hình database
    Kết nối MongoDB được cấu hình trong server/server.js
    Có thể cấu hình trong file .env

Cấu hình môi trường
    Tạo file .env trong thư mục server/
    Thêm các biến môi trường sau:
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/spendwise
    JWT_SECRET=your-secret-key
    OLLAMA_API_URL=http://localhost:11434

Cấu trúc database
    User collection:
    { _id, username, email, password, createdAt }
    Transaction collection:
    { _id, type, amount, date, category, note, username, createdAt }
    Budget collection:
    { _id, username, category, month, amount, createdAt }

API endpoints
    /api/auth/register - Đăng ký tài khoản
    /api/auth/login - Đăng nhập
    /api/auth/me - Lấy thông tin người dùng
    /api/transactions - Lấy danh sách giao dịch
    /api/transactions - Tạo giao dịch mới
    /api/transactions/:id - Cập nhật giao dịch
    /api/transactions/:id - Xóa giao dịch
    /api/budgets - Lấy danh sách ngân sách
    /api/budgets - Tạo ngân sách mới
    /api/budgets/:id - Xóa ngân sách
    /api/chat - Chat với AI
    /api/ai/parse-note - Phân tích ghi chú giao dịch

Ví dụ sử dụng
1. Đăng ký tài khoản
    POST /api/auth/register
    Body: { username: "user1", email: "[EMAIL_ADDRESS]", password: "password" }
2. Đăng nhập
    POST /api/auth/login
    Body: { email: "[EMAIL_ADDRESS]", password: "password" }
3. Lấy danh sách giao dịch
    GET /api/transactions
    Headers: Authorization: Bearer <token>
4. Tạo giao dịch
    POST /api/transactions
    Headers: Authorization: Bearer <token>
    Body: { type: "thu", amount: 1000000, date: "2026-03-30", category: "lương", note: "Tháng 3" }
5. Chat với AI
    POST /api/chat
    Headers: Authorization: Bearer <token>
    Body: { message: "Hôm nay tôi chi bao nhiêu tiền?" }

Ví dụ về giao diện
    Trang đăng nhập: client/welcome_page/welcome_page.html
    Trang tổng quan: client/overview_page/overview_page.html
    Trang giao dịch: client/transaction_page/transaction_page.html
    Trang ngân sách: client/budget_page/budget_page.html
    Trang báo cáo: client/report_page/report_page.html
    Trang chatbot: client/chatbot/chatbot.html

Ví dụ về AI
    Nhập liệu bằng ngôn ngữ tự nhiên:
    "Hôm nay tôi chi 50k tiền ăn sáng"
    "Tháng này tôi đã chi 2 triệu tiền mua sắm"
    Chatbot tư vấn:
    "Danh mục nào chiếm số tiền lớn nhất trong tháng?"
    "Bạn có thể tiết kiệm bao nhiêu nếu giảm chi tiêu 10%?"

Yêu cầu hệ thống
    Node.js 16 trở lên
    MongoDB 4.4 trở lên
    Ollama 0.1.20 trở lên
    RAM: 4GB tối thiểu, 8GB khuyến nghị
    Dung lượng trống: 500MB

Cấu hình Ollama
    Cài đặt Ollama từ https://ollama.com/
    Chạy lệnh sau để tải model:
    ollama pull llama3.1:8b
    Kiểm tra kết nối:
    curl http://localhost:11434/api/tags

Cấu hình MongoDB
    Cài đặt MongoDB từ https://www.mongodb.com/
    Chạy lệnh sau để kiểm tra kết nối:
    mongosh
    use admin
    db.auth("admin", "admin")

Cấu hình Node.js
    Cài đặt Node.js từ https://nodejs.org/
    Cài đặt dependencies:
    npm install
    Chạy server:
    npm start

Cấu hình client
    Mở file HTML trong trình duyệt
    Không cần cài đặt gì thêm

Các vấn đề thường gặp
1. Lỗi kết nối MongoDB
    Kiểm tra MongoDB đã chạy chưa
    Kiểm tra kết nối trong server/server.js
    Kiểm tra biến môi trường MONGODB_URI
2. Lỗi kết nối Ollama
    Kiểm tra Ollama đã chạy chưa
    Kiểm tra biến môi trường OLLAMA_API_URL
    Kiểm tra model đã được tải chưa
3. Lỗi xác thực JWT
    Kiểm tra token còn hiệu lực không
    Kiểm tra biến môi trường JWT_SECRET
4. Lỗi CORS
    Kiểm tra cấu hình CORS trong server/server.js
    Đảm bảo client và server cùng origin
5. Lỗi giao diện
    Kiểm tra console trình duyệt để xem lỗi
    Kiểm tra kết nối mạng
    Kiểm tra file HTML có tồn tại không

Khắc phục sự cố
1. Khởi động lại server
    cd server
    npm restart
2. Xóa cache
    Xóa thư mục node_modules
    npm install
3. Kiểm tra log
    Xem output của lệnh npm start
    Kiểm tra file server/server.log
4. Kiểm tra kết nối
    curl http://localhost:3000/api/health
    curl http://localhost:11434/api/tags
    mongosh --eval "db.stats()"
5. Kiểm tra cấu hình
    Kiểm tra file .env
    Kiểm tra biến môi trường

Tài liệu tham khảo
    Express.js documentation: https://expressjs.com/
    MongoDB documentation: https://docs.mongodb.com/
    Ollama documentation: https://ollama.com/
    JWT documentation: https://jwt.io/
    HTML documentation: https://developer.mozilla.org/en-US/docs/Web/HTML
    CSS documentation: https://developer.mozilla.org/en-US/docs/Web/CSS
    JavaScript documentation: https://developer.mozilla.org/en-US/docs

