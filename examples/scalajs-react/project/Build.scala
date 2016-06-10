import sbt._
import Keys._

import org.scalajs.sbtplugin.ScalaJSPlugin
import ScalaJSPlugin.autoImport._

object Build extends Build {
  val scalaJsReactVersion = "0.10.0"
  val generatedDir        = file("generated")

  val todomvc = Project("todomvc", file("."))
    .enablePlugins(ScalaJSPlugin)
    .settings(
      organization                   := "com.olvind",
      version                        := "1",
      licenses                       += ("Apache-2.0", url("http://opensource.org/licenses/Apache-2.0")),
      scalaVersion                   := "2.11.7",
      scalacOptions                 ++= Seq("-deprecation", "-encoding", "UTF-8", "-feature", "-unchecked", "-Xlint", "-Yno-adapted-args", "-Ywarn-dead-code", "-Ywarn-value-discard" ),
      updateOptions                  := updateOptions.value.withCachedResolution(true),
      sbt.Keys.test in Test          := (),
      emitSourceMaps                 := true,
      /* create javascript launcher. Searches for an object extends JSApp */
      persistLauncher                := true,

      /* javascript dependencies */
      jsDependencies ++= Seq(
        "org.webjars.npm" % "react"     % "0.14.0" / "react-with-addons.js" commonJSName "React"    minified "react-with-addons.min.js",
        "org.webjars.npm" % "react-dom" % "0.14.0" / "react-dom.js"         commonJSName "ReactDOM" minified "react-dom.min.js" dependsOn "react-with-addons.js"
      ),

      /* scala.js dependencies */
      libraryDependencies ++= Seq(
        "com.github.japgolly.scalajs-react" %%% "extra"        % scalaJsReactVersion,
        "com.lihaoyi"                       %%% "upickle"      % "0.3.5"
      ),

      /* move these files out of target/. Also sets up same file for both fast and full optimization */
      crossTarget  in (Compile, fullOptJS)                     := generatedDir,
      crossTarget  in (Compile, fastOptJS)                     := generatedDir,
      crossTarget  in (Compile, packageJSDependencies)         := generatedDir,
      crossTarget  in (Compile, packageScalaJSLauncher)        := generatedDir,
      crossTarget  in (Compile, packageMinifiedJSDependencies) := generatedDir,
      artifactPath in (Compile, fastOptJS)                     :=
        ((crossTarget in (Compile, fastOptJS)).value / ((moduleName in fastOptJS).value + "-opt.js"))
    )
}
