import sbt._
import Keys._

import org.scalajs.sbtplugin.ScalaJSPlugin
import ScalaJSPlugin.autoImport._

object Build extends Build {
  val udashVersion = "0.4.0"
  val udashJQueryVersion = "1.0.0"
  val generatedDir = file("generated")

  val todomvc = Project("todomvc", file("."))
    .enablePlugins(ScalaJSPlugin)
    .settings(
      organization            := "io.udash",
      version                 := "1",
      licenses                += ("Apache-2.0", url("http://opensource.org/licenses/Apache-2.0")),
      scalaVersion            := "2.11.8",
      scalacOptions           ++= Seq("-deprecation", "-encoding", "UTF-8", "-feature", "-unchecked", "-Xlint", "-Yno-adapted-args", "-Ywarn-dead-code"),
      updateOptions           := updateOptions.value.withCachedResolution(true),
      sbt.Keys.test in Test   := (),
      emitSourceMaps          := true,
      persistLauncher         := true,

      /* scala.js dependencies */
      libraryDependencies ++= Seq(
        "io.udash" %%% "udash-core-frontend" % udashVersion,
        "io.udash" %%% "udash-rpc-shared" % udashVersion,
        "io.udash" %%% "udash-jquery" % udashJQueryVersion
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
