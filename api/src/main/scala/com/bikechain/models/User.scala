package com.bikechain.models

import akka.http.scaladsl.model.DateTime

case class User(
    id: Option[Int] = None,
    email: String,
    password: String,
    token: Option[String],
    // todo: should be a Date
    createdAt: String
)

case class CreateUserBody(
    email: String,
    password: String,
    passwordConfirmation: String
)
