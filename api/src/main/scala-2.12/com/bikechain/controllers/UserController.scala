package com.bikechain.controllers

import wiro.annotation.{command, query}
import com.bikechain.data.DBConfig

import scala.concurrent.Future
import com.bikechain.models.{CreateUserBody, Error, NotFoundError, User}
import com.bikechain.data.{Db, DBConfig, UserDataModel}
import com.bikechain.routers.UsersAPI

class UserController()
    extends UsersAPI
    with Db
    with DBConfig
    with UserDataModel {

  import scala.concurrent.ExecutionContext.Implicits.global

  @query
  override def getMe(): Future[Either[NotFoundError, User]] = {
    userDataModel
      .getMe("token")
      .map(
        userOpt =>
          userOpt.fold[Either[NotFoundError, User]](
            Left(NotFoundError("User not found")))(Right.apply))

  }

  @command
  override def create(userBody: CreateUserBody): Future[Either[Error, User]] = {
    userDataModel
      .create(userBody)
  }
}
