package controller;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;

import dao.GradingDAO;
import exception.UnauthorizedException;
import model.UserBasic;
import service.HttpJson;
import util.DBConnectionMain;

/**
 * Servlet implementation class Grading
 */
@WebServlet("/grading")
public class GradingMgr extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GradingMgr() {
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
		response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
		JSONObject jsonResponse = new JSONObject();
		DBConnectionMain dbConn = null;
		Connection conn = null;
		try {
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

			if (!user.isAdmin() && !user.isTeacher()) {
				throw new Error("Không có quyền truy cập");
			}
			
			dbConn = new DBConnectionMain();
			conn = dbConn.getConnection();
			String type = request.getParameter("type") != null ? request.getParameter("type") : "";
			
			String he = json.optString("he", "");
			int khoa = -1; // giá trị mặc định nếu lỗi hoặc không hợp lệ
			if (json.has("khoa")) {
			    try {
			        int tmp = json.getInt("khoa");
			        if (tmp >= 0) {
			            khoa = tmp;
			        }
			    } catch (JSONException e) {
			        // Không cần xử lý gì nếu không đúng định dạng số
			    }
			}
			String mon = json.optString("monThi", "");
			
			switch (type) {
			case "list":{				
				JSONObject result = GradingDAO.gradeExamList(conn, he, khoa, mon);
				jsonResponse.put("data", result);
				break;
			}
			case "update":{
				JSONObject listUpdate = json.optJSONObject("data", new JSONObject());
				if(listUpdate.isEmpty()) {
					jsonResponse.put("notice", "Dữ liệu cập nhật bị rỗng");
					break;
				}
				
				Boolean success = GradingDAO.updateGrading(conn, he, khoa, mon, listUpdate);
				if(!success) throw new Error("Cập nhật không thành công");
				break;
			}
			default:{
				throw new Exception("thuộc tính type không hợp lệ " + type);
				}
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
