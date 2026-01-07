// package util; // ← tùy theo package bạn dùng

// import java.io.IOException;

// import javax.servlet.Filter;
// import javax.servlet.FilterChain;
// import javax.servlet.FilterConfig;
// import javax.servlet.ServletException;
// import javax.servlet.ServletRequest;
// import javax.servlet.ServletResponse;
// import javax.servlet.annotation.WebFilter;
// import javax.servlet.http.HttpServletRequest;
// import javax.servlet.http.HttpServletResponse;

// @WebFilter("/*") // áp dụng cho toàn bộ ứng dụng
// public class CORSFilter implements Filter {

// 	@Override
//     public void init(FilterConfig filterConfig) throws ServletException {
//         // Nếu không cần khởi tạo gì thêm, có thể để trống
// 		java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
//     }
	
//     @Override
//     public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
//         throws IOException, ServletException {
//         HttpServletRequest req = (HttpServletRequest) request;
//         HttpServletResponse res = (HttpServletResponse) response;

//         res.setHeader("Access-Control-Allow-Origin", "http://localhost:18473");
//         res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//         res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//         res.setHeader("Access-Control-Allow-Credentials", "true");
        

//         // Nếu là preflight (OPTIONS), trả về luôn
//         if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
//             res.setStatus(HttpServletResponse.SC_OK);
//             return;
//         }

//         chain.doFilter(request, response);
        
// //        // Sau khi xử lý request, thêm SameSite=None và Secure vào cookie JSESSIONID
// //        Collection<String> headers = res.getHeaders("Set-Cookie");
// //        List<String> modified = new ArrayList<>();
// //        for (String header : headers) {
// //            if (header.startsWith("JSESSIONID")) {
// //                if (!header.contains("SameSite")) {
// //                    header += "; SameSite=None";
// //                }
// //                if (!header.contains("Secure")) {
// //                    header += "; Secure";
// //                }
// //            }
// //            modified.add(header);
// //        }
// //        if (!modified.isEmpty()) {
// //            res.setHeader("Set-Cookie", String.join(",", modified));
// //        }
//     }
    
//     @Override
//     public void destroy() {
//         // Không cần làm gì nếu không có logic cleanup
//     }
// }
