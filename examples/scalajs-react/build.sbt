enablePlugins(ScalaJSPlugin)

name             := "todomvc"
organization     := "com.olvind"
version          := "1"
licenses         += ("Apache-2.0", url("http://opensource.org/licenses/Apache-2.0"))
scalaVersion     := "2.12.5"
scalacOptions   ++= Seq("-deprecation", "-encoding", "UTF-8", "-feature", "-unchecked", "-Xlint", "-Yno-adapted-args", "-Ywarn-dead-code", "-Ywarn-value-discard" )

/* create javascript launcher. Searches for an object extends JSApp */
scalaJSUseMainModuleInitializer  := true

/* javascript dependencies */
jsDependencies ++= Seq(
  "org.webjars.npm" % "react" % "16.2.0"
    /        "umd/react.development.js"
    minified "umd/react.production.min.js"
    commonJSName "React",

  "org.webjars.npm" % "react-dom" % "16.2.0"
    /         "umd/react-dom.development.js"
    minified  "umd/react-dom.production.min.js"
    dependsOn "umd/react.development.js"
    commonJSName "ReactDOM"
)

/* scala.js dependencies */
libraryDependencies ++= Seq(
  "com.github.japgolly.scalajs-react" %%% "extra"   % "1.2.0",
  "com.lihaoyi"                       %%% "upickle" % "0.6.5"
)

/* move these files out of target/. Also sets up same file for both fast and full optimization */
val generatedDir = file("generated")
crossTarget  in (Compile, fullOptJS)                              := generatedDir
crossTarget  in (Compile, fastOptJS)                              := generatedDir
crossTarget  in (Compile, packageJSDependencies)                  := generatedDir
crossTarget  in (Compile, scalaJSUseMainModuleInitializer)        := generatedDir
crossTarget  in (Compile, packageMinifiedJSDependencies)          := generatedDir
artifactPath in (Compile, fastOptJS)                              :=
  ((crossTarget in (Compile, fastOptJS)).value / ((moduleName in fastOptJS).value + "-opt.js"))