package live.connector.vertxui.samples.server.todomvc;

import java.lang.invoke.MethodHandles;
import java.util.logging.Level;
import java.util.logging.Logger;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Context;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import live.connector.vertxui.samples.client.todomvc.View;
import live.connector.vertxui.server.FigWheely;
import live.connector.vertxui.server.VertxUI;

public class Server extends AbstractVerticle {

	private final static Logger log = Logger.getLogger(MethodHandles.lookup().lookupClass().getName());

	public static void main(String[] args) {
		Vertx.vertx().deployVerticle(MethodHandles.lookup().lookupClass().getName());
	}

	@Override
	public void start() {
		boolean debug = true;

		// This line usually compiles java to javascript, generates a index.html
		// and serves the index.html and the javascript. However, this
		// application is also an example for using an existing index.html.
		// The only difference is at startup time: call VertxUI.with()
		// with url=null (2nd parameter) so it only compiles, give false
		// as last parameter so that there is no index.html generated (not
		// necessary), and then server folder /a/ with the javascript yourself.
		VertxUI.with(View.class, null, debug, false);
		Router router = Router.router(vertx);
		router.get("/a/*").handler(StaticHandler.create(VertxUI.getTargetFolder(debug) + "/a"));

		// serve the already existing index.html and .css files.
		router.get("/*").handler(FigWheely.staticHandler("assets/todos", "/"));

		// if debugging, figwheely can notify the browser of code changes.
		if (debug) {
			router.get("/figwheely.js").handler(FigWheely.create());
		}

		// Make sure that when we exit, we close vertxes too.
		Runtime.getRuntime().addShutdownHook(new Thread() {
			public void run() {
				Context context = Vertx.currentContext();
				if (context == null) {
					return;
				}
				Vertx vertx = context.owner();
				vertx.deploymentIDs().forEach(vertx::undeploy);
				vertx.close();
			}
		});

		// Create and start the server
		vertx.createHttpServer(new HttpServerOptions().setCompressionSupported(true)).requestHandler(router::accept)
				.listen(80, listenHandler -> {
					if (listenHandler.failed()) {
						log.log(Level.SEVERE, "Startup error", listenHandler.cause());
						System.exit(0);// stop on startup error
					}
				});
	}

}