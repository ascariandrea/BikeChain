resolvers += "buildo at bintray" at "https://dl.bintray.com/buildo/maven"
resolvers += Resolver.sonatypeRepo("releases")

addCompilerPlugin(
  "org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full
)

name := "BikeChainAPI"

version := "0.1"

scalaVersion := "2.12.8"

val log4jVersion = "2.11.1"
val slickVersion = "3.2.3"
val slickJodaMapperVersion = "2.3.0"
val akkaHTTPVersion = "10.1.7"
val wiroVersion = "0.7.1"
val enumeroVersion = "1.3.0"

libraryDependencies ++= Seq(
  "io.buildo" %% "wiro-http-server" % wiroVersion,
  "io.buildo" %% "enumero" % enumeroVersion,
  "io.buildo" %% "enumero-circe-support" % enumeroVersion,
  "io.spray" %% "spray-json" % "1.3.5",
  "com.typesafe.slick" %% "slick" % slickVersion,
  "com.typesafe.slick" %% "slick-hikaricp" % "3.2.0",
  "com.github.tminglei" %% "slick-pg" % "0.16.3",
  "com.github.tminglei" %% "slick-pg_circe-json" % "0.16.3",
  "com.github.tototoshi" %% "slick-joda-mapper" % slickJodaMapperVersion,
  "joda-time" % "joda-time" % "2.7",
  "org.joda" % "joda-convert" % "1.7",
  "org.apache.logging.log4j" % "log4j-slf4j-impl" % log4jVersion,
  "org.apache.logging.log4j" % "log4j-api" % log4jVersion,
  "org.apache.logging.log4j" % "log4j-core" % log4jVersion,
  "com.typesafe" % "config" % "1.3.2"
)

val circeVersion = "0.10.0"

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core",
  "io.circe" %% "circe-generic",
  "io.circe" %% "circe-parser"
).map(_ % circeVersion)

libraryDependencies ++= Seq(
  "io.buildo" %% "wiro-http-server" % wiroVersion,
  "org.scalatest" %% "scalatest" % "3.0.5",
  "com.typesafe.akka" %% "akka-http" % akkaHTTPVersion,
  "com.typesafe.akka" %% "akka-testkit" % "2.5.14",
  "com.typesafe.akka" %% "akka-http-testkit" % akkaHTTPVersion,
  "de.heikoseeberger" %% "akka-http-circe" % "1.24.3"
).map(_ % Test)

javaOptions ++= Seq(
  "-Dlog4j.configurationFile=conf/log4j2.xml"
)

javaOptions in Test ++= Seq(
  "-Dlog4j.configurationFile=conf/log4j2.xml",
  "-Dcom.sun.xml.bind.v2.bytecode.ClassTailor.noOptimize=true"
)

fork in run := true
fork in Test := true
cancelable in Global := true

coverageMinimum := 80
coverageFailOnMinimum := true

mainClass in (Compile, run) := Some("com.bikechain.BikeChainApp")

lazy val root = (project in file("."))
  .settings(
    flywayUrl := sys.env
      .get("DATABASE_URL")
      .getOrElse("jdbc:postgresql://127.0.0.1:5432/bikechain"),
    flywayUser := sys.env.get("DATABASE_USER").getOrElse("root"),
    flywayPassword := sys.env.get("DATABASE_PASSWORD").getOrElse("password")
  )
  .enablePlugins(FlywayPlugin)
  .enablePlugins(JavaServerAppPackaging)
