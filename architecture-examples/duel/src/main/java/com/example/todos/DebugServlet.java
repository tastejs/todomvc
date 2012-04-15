package com.example.todos;

import java.io.*;
import java.util.*;
import javax.servlet.http.*;
import org.duelengine.duel.*;
import com.example.todos.views.*;

@SuppressWarnings("serial")
public class DebugServlet extends HttpServlet {

	/*
	 * This servlet does nothing more than render the `index` view in dev mode
	 * With this, the JS, CSS & views are not compacted and so are able to be
	 * stepped through in the JS debugger.
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) {
		try {
			// response headers
			response.setContentType("text/html");
			response.setCharacterEncoding("UTF-8");

			// put anything in the query string to see compacted version
			boolean isDevMode = (request.getQueryString() == null);

			// response body
			new HomePage().render(
				new DuelContext()
					.setFormat(new FormatPrefs()
						.setEncoding("UTF-8")
						.setIndent("\t")
						.setNewline("\n"))
					.setLinkInterceptor(new CDNLinkInterceptor(
						"", // just rooted URLs
						ResourceBundle.getBundle("cdn", Locale.ROOT),
						isDevMode))
//					.setData(/*not used*/)
//					.putExtras(/*not used*/)
					.setOutput(response.getWriter()));

		} catch (Exception ex) {
			try {
				ex.printStackTrace(response.getWriter());
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

			} catch (IOException ex2) {
				ex2.printStackTrace();
			}
		}
	}
}