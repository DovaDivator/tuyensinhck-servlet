package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnectionMain {

    private Connection con;

    private static final String URL =
        "jdbc:mysql://mysql:3306/tuyensinh" +
        "?allowPublicKeyRetrieval=true" +
        "&useSSL=false" +
        "&serverTimezone=Asia/Ho_Chi_Minh";

    private static final String USER = "root";
    private static final String PASSWORD = "123456a@";

    public DBConnectionMain() throws ClassNotFoundException {
        Class.forName("com.mysql.cj.jdbc.Driver");
    }

    public Connection getConnection() throws SQLException {
        if (con == null || con.isClosed()) {
            con = DriverManager.getConnection(URL, USER, PASSWORD);
        }
        return con;
    }
}
