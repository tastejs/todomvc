import org.scalajs.sbtplugin.ScalaJSPlugin.autoImport._
import sbt._

object Dependencies {
  val udashCoreVersion = "0.6.0"
  val udashJQueryVersion = "1.1.0"
  val uPickleVersion = "0.5.1"

  val frontendDeps = Def.setting(Seq[ModuleID](
    "io.udash" %%% "udash-core-frontend" % udashCoreVersion,
    "io.udash" %%% "udash-css-frontend" % udashCoreVersion,
    "io.udash" %%% "udash-jquery" % udashJQueryVersion,
    "com.lihaoyi" %%% "upickle" % uPickleVersion
  ))
}