package com.bikechain.models

import org.joda.time.DateTime
import io.circe.generic.JsonCodec
import io.circe.syntax._

case class User(
    id: Int,
    email: String,
    password: String,
    salt: String,
    token: Option[String] = None,
    createdAt: DateTime
)

@JsonCodec case class APIUser(
    id: Int,
    email: String,
    createdAt: String
)

object APIUser {
  def fromDataUser(u: User): APIUser =
    APIUser(
      id = u.id,
      email = u.email,
      createdAt = u.createdAt.toString
    )
}

@JsonCodec case class SignUpBody(
    email: String,
    password: String,
    passwordConfirmation: String
)

@JsonCodec case class LoginBody(
    email: String,
    password: String
)
