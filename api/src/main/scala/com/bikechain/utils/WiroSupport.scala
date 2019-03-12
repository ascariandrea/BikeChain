package com.bikechain.utils

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import com.bikechain.controllers.{DeviceController, UserController}
import com.bikechain.models.{
  APIDevice,
  Error,
  APIUser,
  SignUpBody,
  LoginBody,
  CreateDeviceBody
}
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
  StatusCodes,
  StatusCode
}
import scala.util.control.NonFatal
import wiro.server.akkaHttp._
import wiro.server.akkaHttp.FailSupport._
import akka.http.scaladsl.model.MediaTypes
import com.typesafe.config.ConfigFactory
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

trait WiroSupport {

  implicit val authDecoder: Decoder[Auth] = deriveDecoder
  implicit val authEncoder: Encoder[Auth] = deriveEncoder

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

  implicit def errorToResponse = new ToHttpResponse[Error] {

    def response(error: Error) = {
      HttpResponse(
        status = error.code match {
          case 401 => StatusCodes.Unauthorized
          case 422 => StatusCodes.UnprocessableEntity
          case _   => StatusCodes.InternalServerError
        },
        entity = HttpEntity(
          ContentType(MediaTypes.`application/json`),
          error.asJson.noSpaces
        )
      )
    }
  }
}
