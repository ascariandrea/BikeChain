package com.bikechain.utils

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import com.bikechain.controllers.{DeviceController, UserController}
import com.bikechain.models.{Device, Error, APIUser, SignUpBody, LoginBody}
import com.bikechain.routers.{DevicesAPI, UsersAPI}
import io.circe.{Decoder, Encoder}
import wiro.{Auth, Config}
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

trait WiroSupport {
  implicit val errorDecoder: Decoder[Error] = deriveDecoder

  val dateFormatter = DateTimeFormat.forPattern("yyyyMMdd")
  implicit val dateTimeDecoder: Decoder[DateTime] = Decoder.decodeString.emap {
    s =>
      try {
        Right(DateTime.parse(s, dateFormatter))
      } catch {
        case NonFatal(e) => Left(e.getMessage)
      }
  }
  implicit val dateTimeEncoder: Encoder[DateTime] =
    Encoder.encodeString.contramap[DateTime](_.toString)

  implicit val userDecoder: Decoder[APIUser] = deriveDecoder
  implicit val userEncoder: Encoder[APIUser] = deriveEncoder

  // implicit val signUpBodyDecoder: Decoder[SignUpBody] = deriveDecoder
  implicit val signUpBodyEncoder: Encoder[SignUpBody] = deriveEncoder
  implicit val loginBodyEncoder: Encoder[LoginBody] = deriveEncoder

  implicit val deviceDecoder: Decoder[Device] = deriveDecoder
  implicit val deviceEncoder: Encoder[Device] = deriveEncoder

  implicit val authDecoder: Decoder[Auth] = deriveDecoder
  implicit val authEncoder: Encoder[Auth] = deriveEncoder

  implicit def errorToResponse = new ToHttpResponse[Error] {

    def response(error: Error) = {
      println(error)
      HttpResponse(
        status = StatusCodes.InternalServerError,
        entity = HttpEntity(
          ContentType(MediaTypes.`application/json`),
          error.asJson.noSpaces
        )
      )
    }
  }
}
