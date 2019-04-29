package com.bikechain

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import com.bikechain.controllers.{DeviceController, UserController}
import com.bikechain.models.{Device, Error, User}
import com.bikechain.routers.{DevicesAPI, UsersAPI}
import io.circe.{Decoder, Encoder}
import wiro.Config
import io.circe.generic.auto._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import akka.http.scaladsl.model.{
  ContentType,
  HttpEntity,
  HttpResponse,
  StatusCodes
}
import scala.util.control.NonFatal
import wiro.server.akkaHttp._
import wiro.server.akkaHttp.FailSupport._
import akka.http.scaladsl.model.MediaTypes
import com.typesafe.config.ConfigFactory
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import com.bikechain.utils.WiroSupport
import com.bikechain.data.DbConfiguration

object BikeChainApp
    extends App
    with WiroSupport
    with RouterDerivationModule
    with DbConfiguration {
  implicit val system = ActorSystem()
  implicit val materializer = ActorMaterializer()
  implicit val ec = system.dispatcher

  implicit val config = ConfigFactory.load("bikechain")

  val usersRouter =
    deriveRouter[UsersAPI](new UserController(dbConfig))
  val devicesRouter =
    deriveRouter[DevicesAPI](new DeviceController(dbConfig))

  val rpcServer = new HttpRPCServer(
    config = Config("0.0.0.0", config.getInt("port")),
    routers = List(usersRouter, devicesRouter)
  )

}
