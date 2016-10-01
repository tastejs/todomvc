enablePlugins(SbtJsEngine)

scalaVersion in Global := "2.11.8"

lazy val js = project

val indexHtml = taskKey[File]("Generate an index.html that follows TodoMVC's Application Specification")

indexHtml := {
  val linkedJs = (scalaJSLinkedFile in js in Compile).value.asInstanceOf[org.scalajs.core.tools.io.FileVirtualJSFile]
  val document = <html lang="en" data-framework="binding-scala">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>Binding.scala • TodoMVC</title>
      {
        for {
          file <- (JsEngineKeys.npmNodeModules in Assets).value
          if file.getName.endsWith(".css")
        } yield <link rel="stylesheet" href={ file.relativeTo(baseDirectory.value).get.toString }/>
      }
    </head>
    <body>
      <script type="text/javascript" src="node_modules/todomvc-common/base.js"></script>
      <script type="text/javascript" src={ linkedJs.file.relativeTo(baseDirectory.value).get.toString }></script>
      <div id="application-container"></div>
      <script type="text/javascript"> com.thoughtworks.todo.Main().main(document.getElementById('application-container')) </script>
    </body>
  </html>
  val outputFile = baseDirectory.value / "index.html"
  IO.writeLines(outputFile, Seq("<!DOCTYPE html>", xml.Xhtml.toXhtml(document)))
  outputFile
}
