package controller;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import dao.AddManagerDAO;
import exception.UnauthorizedException;
import model.UserBasic;
import service.HttpJson;
import util.DBConnectionMain;

/**
 * Servlet implementation class AddManager
 */
@WebServlet("/api/add")
public class AddManager extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AddManager() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
				JSONObject jsonResponse = new JSONObject();
				DBConnectionMain dbConn = null;
				Connection conn = null;
				try {
					String type = request.getParameter("type");
					String body = HttpJson.readRequestBody(request);
					JSONObject json = new JSONObject(body);

					String token = request.getHeader("Authorization");
					if (token == null || !token.startsWith("Bearer ")) {
						throw new Exception("Token không hợp lệ hoặc thiếu");
					}
		
					token = token.substring(7); // cắt "Bearer "
					HttpSession session = request.getSession(false);
		
					// Kiểm tra token và xác minh quyền admin
					if (session == null)
						throw new Error("Session không tồn tại hoặc đã hết hạn");
		
					UserBasic user = (UserBasic) session.getAttribute("user");
					String sessionToken = (String) session.getAttribute("token");
		
					if (user == null || sessionToken == null || !sessionToken.equals(token))
						throw new Error("User không tồn tại trong session");
		
					if (!user.isAdmin()) {
						throw new Error("Không có quyền truy cập");
					}


					dbConn = new DBConnectionMain();
					conn = dbConn.getConnection();

					Boolean success = false;

					switch (type) {
					case "teacher":{
						String name = json.getString("name");
						String email = json.getString("email");
						String phone = json.getString("phone");
						String password = json.getString("password");
						String mon = json.getString("mon");
						success = AddManagerDAO.addTeacher(conn, name, email, phone, password, mon);
						break;
						}
					default:
						throw new Exception("thuộc tính type không hợp lệ " + type);
					}
					
					if (!success) {
						throw new UnauthorizedException("Cập nhật không thành công!");
					}
					jsonResponse.put("success", true);
					jsonResponse.put("message", "Cập nhật thành công!");
				} catch (Exception e) {
					if (e instanceof UnauthorizedException) {
						response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					} else {
						response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
					}
					jsonResponse.put("success", false);
					jsonResponse.put("message", e.getMessage());
				} finally {
					if (conn != null) {
				        try {
				            conn.close();
				        } catch (Exception e) {
				            System.err.println("Không thể đóng kết nối: " + e.getMessage());
				        }
				    }
				}
				
				response.getWriter().write(jsonResponse.toString());
	}

}
