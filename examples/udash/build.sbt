name := "todomvc"

inThisBuild(Seq(
  version := "0.6.0",
  scalaVersion := "2.12.4",
  organization := "io.udash",
  scalacOptions ++= Seq(
    "-feature",
    "-deprecation",
    "-unchecked",
    "-language:implicitConversions",
    "-language:existentials",
    "-language:dynamics",
    "-Xfuture",
    "-Xfatal-warnings",
    "-Xlint:_,-missing-interpolator,-adapted-args"
  ),
))

val generatedDir = file("generated")

val todomvc = project.in(file("."))
  .enablePlugins(ScalaJSPlugin)
  .settings(
    mainClass := Some("io.udash.todo.JSLauncher"),
    scalaJSUseMainModuleInitializer := true,

    libraryDependencies ++= Dependencies.frontendDeps.value,

    // Target files for Scala.js plugin
    Compile / fastOptJS / artifactPath := generatedDir / "todomvc.js",
    Compile / fullOptJS / artifactPath := generatedDir / "todomvc.js",
    Compile / packageJSDependencies / artifactPath := generatedDir / "todomvc-deps.js",
    Compile / packageMinifiedJSDependencies / artifactPath := generatedDir / "todomvc-deps.js",
  )