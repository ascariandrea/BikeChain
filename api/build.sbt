resolvers += "buildo at bintray" at "https://dl.bintray.com/buildo/maven"
resolvers += Resolver.sonatypeRepo("releases")

addCompilerPlugin(
  "org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full
)

name := "BikeChainAPI"

version := "0.1"

scalaVersion := "2.12.7"

libraryDependencies ++= Seq(
  "io.buildo" %% "wiro-http-server" % "0.6.13",
  "com.typesafe.slick" %% "slick" % "3.2.3",
  "com.github.tminglei" %% "slick-pg" % "0.16.3",
  "com.github.tminglei" %% "slick-pg_circe-json" % "0.16.3",
  "org.slf4j" % "slf4j-nop" % "1.6.4",
  "com.typesafe" % "config" % "1.3.2"
)

val circeVersion = "0.10.0"

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core",
  "io.circe" %% "circe-generic",
  "io.circe" %% "circe-parser"
).map(_ % circeVersion)

fork in run := true
cancelable in Global := true

lazy val root = (project in file("."))
