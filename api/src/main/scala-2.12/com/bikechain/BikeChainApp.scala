package com.bikechain

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import com.bikechain.controllers.{DeviceController, UserController}
import com.bikechain.models.{Device, Error, NotFoundError, User}
import com.bikechain.routers.{DevicesAPI, UsersAPI}
import io.circe.{Decoder, Encoder}
import wiro.Config
import wiro.server.akkaHttp._
import io.circe.generic.auto._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import wiro.server.akkaHttp.ToHttpResponse
import wiro.server.akkaHttp.FailSupport._
import akka.http.scaladsl.model.{
  ContentType,
  HttpEntity,
  HttpResponse,
  StatusCodes
}
import akka.http.scaladsl.model.MediaTypes
import com.typesafe.config.ConfigFactory

object BikeChainApp extends App with RouterDerivationModule {
  implicit val system = ActorSystem()
  implicit val materializer = ActorMaterializer()
  implicit val ec = system.dispatcher

  implicit val errorDecoder: Decoder[Error] = deriveDecoder
  implicit val userNotFoundErrorDecoder: Decoder[NotFoundError] = deriveDecoder

  implicit val userDecoder: Decoder[User] = deriveDecoder
  implicit val userEncoder: Encoder[User] = deriveEncoder

  implicit val deviceDecoder: Decoder[Device] = deriveDecoder
  implicit val deviceEncoder: Encoder[Device] = deriveEncoder

  implicit val config = ConfigFactory.load("com/bikechain")

  implicit def notFoundToResponse = new ToHttpResponse[NotFoundError] {
    def response(error: NotFoundError) = HttpResponse(
      status = StatusCodes.NotFound,
      entity = HttpEntity(ContentType(MediaTypes.`application/json`),
                          error.asJson.noSpaces)
    )
  }

  implicit def errorToResponse = new ToHttpResponse[Error] {

    def response(error: Error) = HttpResponse(
      status = StatusCodes.InternalServerError,
      entity = HttpEntity(ContentType(MediaTypes.`application/json`),
                          error.asJson.noSpaces)
    )
  }

  val usersRouter = deriveRouter[UsersAPI](new UserController())
  val devicesRouter = deriveRouter[DevicesAPI](new DeviceController())

  CreateTables.createIfNotExist()

  val rpcServer = new HttpRPCServer(
    config = Config("0.0.0.0", 8080),
    routers = List(usersRouter, devicesRouter)
  )
}
