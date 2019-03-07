package com.bikechain.routers

import wiro.Auth
import wiro.annotation.{command, path, query}
import com.bikechain.models.{
  APIUser,
  Error,
  User,
  SignUpBody,
  LoginBody,
  EmptyResponse
}

import scala.concurrent.Future

@path("users")
trait UsersAPI {

  @query
  def me(token: Auth): Future[Either[Error, APIUser]]

  @command
  def login(email: String, password: String): Future[Either[Error, Auth]]

  @command
  def signUp(
      email: String,
      password: String,
      passwordConfirmation: String
  ): Future[Either[Error, APIUser]]

  @command
  def logout(token: Auth): Future[Either[Error, EmptyResponse]]

}
