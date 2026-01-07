package controller;

import java.io.IOException;
import java.util.Base64;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import model.UserBasic;

/**
 * Servlet implementation class GetUserBasicApi
 */
@WebServlet("api/get-session")
public class GetUserSession extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public GetUserSession() {
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
		response.getWriter().append("Served at: lay session").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		JSONObject jsonResponse = new JSONObject();
		try {
			String token = null;
			String authHeader = request.getHeader("Authorization");
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				token = authHeader.substring(7); // bỏ "Bearer " ra
			} else {
				throw new Error("Không có Header");
			}

			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");

			HttpSession session = request.getSession(false);

			if (session != null) {
				UserBasic user = (UserBasic) session.getAttribute("user");
				String sessionToken = (String) session.getAttribute("token");
				if (user != null && sessionToken != null && sessionToken.equals(token)) {
					JSONObject userJson = new JSONObject();
					userJson.put("id", user.getId());
					userJson.put("name", user.getName());
					userJson.put("role", user.getRole());

					// avatarImg là mảng byte[], bạn có thể convert sang base64 để dễ gửi JSON
					if (user.getAvatar() != null) {
						String avatarBase64 = Base64.getEncoder().encodeToString(user.getAvatar());
						userJson.put("avatarImg", avatarBase64);
					} else {
						userJson.put("avatarImg", JSONObject.NULL);
					}

					jsonResponse.put("success", true);
					jsonResponse.put("data", userJson);
				} else {

					throw new Error("User không tồn tại trong session");
				}
			} else {
				throw new Error("Session không tồn tại hoặc đã hết hạn");
			}
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			jsonResponse.put("success", false);
			jsonResponse.put("message", e.getMessage());
		} finally {
			response.getWriter().write(jsonResponse.toString());
		}
	}

}
