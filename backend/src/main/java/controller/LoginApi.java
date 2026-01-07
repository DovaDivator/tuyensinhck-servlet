package controller;

import java.io.IOException;
import java.sql.Connection;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import dao.LoginDAO;
import exception.UnauthorizedException;
import model.UserBasic;
import service.HttpJson;
import util.DBConnectionMain;

@WebServlet("/login")
public class LoginApi extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: login").append(request.getContextPath());
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// Parse input JSON
		JSONObject jsonResponse = new JSONObject();
		DBConnectionMain dbConn = null;
		Connection conn = null;

		try {
			String body = HttpJson.readRequestBody(request);
			JSONObject json = new JSONObject(body);

			String username = json.getString("username");
			String password = json.getString("password");

			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");

			dbConn = new DBConnectionMain();
			conn = dbConn.getConnection();

			UserBasic user = LoginDAO.findUserByLogin(conn, username, password);
			if (user.isNull())
				throw new UnauthorizedException("Tài khoản không hợp lệ hoặc đã bị khóa!");

			String token = generateToken();

			HttpSession session = request.getSession();
			session.setMaxInactiveInterval(3 * 60 * 60);
			session.setAttribute("user", user);
			session.setAttribute("token", token);

			jsonResponse.put("success", true);
			jsonResponse.put("message", "Đăng nhập thành công!");
			jsonResponse.put("token", token);

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

	private String generateToken() {
		return UUID.randomUUID().toString();
	}
}
