package com.bikechain.routers

import wiro.annotation.{command, path, query}
import com.bikechain.models.{Error, NotFoundError, User, CreateUserBody}

import scala.concurrent.Future

@path("users")
trait UsersAPI {

  @query
  def getMe(): Future[Either[NotFoundError, User]]

  @command
  def create(user: CreateUserBody): Future[Either[Error, User]]
}
