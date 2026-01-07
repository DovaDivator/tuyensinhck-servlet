QUAN TRỌNG: TRƯỚC KHI CHẠY, TRỎ VÀO ĐÚNG THƯ MỤC CHỨA DOCKER-COMPOSE.YML
VD:
	docker-compose.yml nằm ở thư mục D:/abc/xyz
	chạy cd "D:/abc/xyz"

---------
//Lấy file init ra (chạy từng dòng)
docker exec mysql-tuyensinh sh -c "mysqldump -u root -p123456a@ --default-character-set=utf8mb4 --routines --events --triggers --all-databases > /tmp/temp_init.sql"
docker cp mysql-tuyensinh:/tmp/temp_init.sql ./init.sql

---------
// tạo container mới
docker-compose down 
docker-compose build
docker-compose up -d

---------
NOTE:
- Dể có thể dùng được database, bắt buộc phải chạy lần lượt như sau (sau khi cài đặt container thành công)
- Đảm bảo image backend đang chạy (servlet-backend)

docker exec -it servlet-backend bash
apt update
apt install -y iputils-ping netcat-openbsd default-mysql-client

(!): Chỉ áp dụng cho các phiên bản dùng java servlet (hiện tại)
