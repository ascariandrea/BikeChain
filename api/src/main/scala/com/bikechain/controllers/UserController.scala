package com.bikechain.controllers

import wiro.Auth
import wiro.annotation.{command, query}

import scala.concurrent.Future
import com.bikechain.models.{SignUpBody, Error, User, APIUser, LoginBody}
import com.bikechain.utils.{ErrorSerializers, HashUtil, EmailUtil}
import com.bikechain.data.{Db, DBConfig, UserDataModel}
import com.bikechain.routers.UsersAPI

class UserController()
    extends UsersAPI
    with Db
    with DBConfig
    with UserDataModel {

  import scala.concurrent.ExecutionContext.Implicits.global

  override def signUp(
      email: String,
      password: String,
      passwordConfirmation: String
  ): Future[Either[Error, APIUser]] = {
    checkEmailAndPassword(email, password)((salt, hash) => {
      userDataModel
        .create(email, hash, salt)
        .map(result => result.map(APIUser.fromDataUser))
    })

  }

  override def login(
      email: String,
      password: String
  ): Future[Either[Error, Auth]] = {
    userDataModel.findByEmail(email).flatMap {
      case Right(user)
          if (user.password
            .equals(HashUtil.saltAndHash(password, user.salt))) => {
        val token = HashUtil.randomAlphanumericString(26)
        userDataModel.updateToken(email, token)
      }
      case _ =>
        Future(Left(ErrorSerializers.toNotFoundError("user", "email", email)))
    }
  }

  override def me(token: Auth): Future[Either[Error, APIUser]] = {
    userDataModel
      .getMe(token.token)
      .map(
        result => result.map(APIUser.fromDataUser)
      )
  }

  private def checkEmailAndPassword[T](email: String, password: String)(
      f: (String, String) => Future[Either[Error, T]]
  ): Future[Either[Error, T]] =
    if (EmailUtil.isValid(email)) {
      val salt = HashUtil.randomAlphanumericString(64)
      val hash = HashUtil.saltAndHash(password, salt)
      f(salt, hash)
    } else {
      Future(
        Left(ErrorSerializers.toInvalidParamError("email", email))
      )
    }
}
