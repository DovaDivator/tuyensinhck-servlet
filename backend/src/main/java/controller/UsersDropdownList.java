package controller;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;

import dao.UserDropdownDAO;
import model.UserBasic;
import util.DBConnectionMain;

/**
 * Servlet implementation class UsersDropdownList
 */
@WebServlet("api/users-dropdown")
public class UsersDropdownList extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UsersDropdownList() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		JSONObject jsonResponse = new JSONObject();
		DBConnectionMain dbConn = null;
		Connection conn = null;

		try {
			// Lấy token từ header
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
//			
			String type = request.getParameter("type");

			dbConn = new DBConnectionMain();
			conn = dbConn.getConnection();

			String result = "";

			switch (type) {
			case "tu-chon": {
				result = UserDropdownDAO.getMonTuChon(conn);
				break;
			}
			case "ngoai-ngu": {
				result = UserDropdownDAO.getMonNgoaiNgu(conn);
				break;
			}
			case "mon-hoc": {
				result = UserDropdownDAO.getMonHoc(conn);
				break;
			}
			default:
				throw new Exception("thuộc tính type không hợp lệ " + type);
			}

			jsonResponse.put("success", true);
			jsonResponse.put("message", "Lấy dữ liệu thành công!");
			jsonResponse.put("data", new JSONArray(result));

		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			jsonResponse.put("success", false);
			jsonResponse.put("message", e.getMessage());
		}finally {
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


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
