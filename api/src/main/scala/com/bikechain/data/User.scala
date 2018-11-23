package com.bikechain.data

import com.bikechain.models.{CreateUserBody, Error, User}

import scala.concurrent.Future

trait UserDataModel {
  db: Db =>

  import com.bikechain.core.PostgresProfile.api._

  class Users(tag: Tag) extends Table[User](tag, "users") {
    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def email = column[String]("email")

    def password = column[String]("password")

    def token = column[String]("token")

    // todo: should be a Date
    def createdAt = column[String]("created_at")

    def * =
      (id.?, email, password, token.?, createdAt) <> (User.tupled, User.unapply)
  }

  val users = TableQuery[Users]

  object UserDataModel {
    def getMe(token: String): Future[Option[User]] = ???

    def create(userBody: CreateUserBody): Future[Either[Error, User]] = ???
  }

  lazy val userDataModel = UserDataModel
}
