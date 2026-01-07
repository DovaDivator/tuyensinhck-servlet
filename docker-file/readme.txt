//Lấy file init ra (chạy từng dòng)
docker exec mysql-tuyensinh sh -c "mysqldump -u root -p123456a@ --default-character-set=utf8mb4 --routines --events --triggers --all-databases > /tmp/temp_init.sql"
docker cp mysql-tuyensinh:/tmp/temp_init.sql ./init.sql

// tạo container mới
docker-compose down 
docker-compose build
docker-compose up -d

// Tái khởi động tự động hóa
docker exec -i mysql-tuyensinh mysql -uroot -p123456a@ < automatic.sql
