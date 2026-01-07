package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnectionMain {
	private Connection con;
    
    public Connection getConnection() {
        return this.con;
    }
	
	public DBConnectionMain() throws SQLException, ClassNotFoundException {
        String url = 
        "jdbc:mysql://localhost:3315/tuyensinh"+ 
        "?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=Asia/Ho_Chi_Minh";
        String user = "root";
        String password = "123456a@";
        Class.forName("com.mysql.cj.jdbc.Driver");
        this.con = DriverManager.getConnection(url, user, password);
    }
}
