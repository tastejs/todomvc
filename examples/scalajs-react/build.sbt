enablePlugins(ScalaJSPlugin)

name             := "todomvc"
organization     := "com.olvind"
version          := "1"
licenses         += ("Apache-2.0", url("http://opensource.org/licenses/Apache-2.0"))
scalaVersion     := "2.11.8"
scalacOptions   ++= Seq("-deprecation", "-encoding", "UTF-8", "-feature", "-unchecked", "-Xlint", "-Yno-adapted-args", "-Ywarn-dead-code", "-Ywarn-value-discard" )

/* create javascript launcher. Searches for an object extends JSApp */
persistLauncher  := true

/* javascript dependencies */
jsDependencies ++= Seq(
  "org.webjars.bower" % "react" % "15.2.1" / "react-with-addons.js" minified "react-with-addons.min.js" commonJSName "React",
  "org.webjars.bower" % "react" % "15.2.1" / "react-dom.js"         minified "react-dom.min.js" dependsOn "react-with-addons.js" commonJSName "ReactDOM"
)

/* scala.js dependencies */
libraryDependencies ++= Seq(
  "com.github.japgolly.scalajs-react" %%% "extra"   % "0.11.1",
  "com.lihaoyi"                       %%% "upickle" % "0.4.1"
)

/* move these files out of target/. Also sets up same file for both fast and full optimization */
val generatedDir = file("generated")
crossTarget  in (Compile, fullOptJS)                     := generatedDir
crossTarget  in (Compile, fastOptJS)                     := generatedDir
crossTarget  in (Compile, packageJSDependencies)         := generatedDir
crossTarget  in (Compile, packageScalaJSLauncher)        := generatedDir
crossTarget  in (Compile, packageMinifiedJSDependencies) := generatedDir
artifactPath in (Compile, fastOptJS)                     :=
  ((crossTarget in (Compile, fastOptJS)).value / ((moduleName in fastOptJS).value + "-opt.js"))