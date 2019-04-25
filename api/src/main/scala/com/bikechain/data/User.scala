package com.bikechain.data

import com.bikechain.models.{SignUpBody, Error, User}
import com.bikechain.data.utils.DBSerializers
import com.bikechain.utils.{ErrorSerializers, HashUtil}
import scala.concurrent.Future
import com.bikechain.core.PostgresProfile.api._
import com.github.tototoshi.slick.PostgresJodaSupport._
import org.joda.time.DateTime
import wiro.Auth

trait UserDataModel {
  this: Db =>

  import scala.concurrent.ExecutionContext.Implicits.global

  class Users(tag: Tag) extends Table[User](tag, "users") with CreatedAtColumn {

    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def email = column[String]("email", O.Unique)

    def password = column[String]("password")

    def salt = column[String]("salt")

    def token = column[Option[String]]("token")

    def * =
      (id, email, password, salt, token, createdAt) <> (User.tupled, User.unapply)
  }

  val users = TableQuery[Users]

  object UserDataModel {
    def getMe(token: String): Future[Either[Error, User]] =
      db.run(users.filter(_.token === token).result.asTry)
        .map(
          DBSerializers
            .toResult(
              r => r.headOption,
              ErrorSerializers.toUnauthorizedError
            )
        )

    def findByEmail(email: String): Future[Either[Error, User]] =
      db.run(users.filter(_.email === email).result.asTry)
        .map(DBSerializers.toResult(r => r.headOption))

    def updateToken(
        email: String,
        token: Option[String]
    ): Future[Either[Error, Auth]] = {
      db.run(
          users
            .filter(
              u => u.email === email
            )
            .map(u => u.token)
            .update(token)
        )
        .flatMap {
          case 1 => {
            if (token.isDefined) {
              db.run(users.filter(_.token === token.get).result.asTry)
                .map(
                  DBSerializers
                    .toResult(
                      u =>
                        u.headOption
                          .flatMap(u => u.token.map(t => Auth(t)))
                    )
                )
            } else {
              Future(Right(Auth(null)))
            }
          }
          case _ => Future(Left(Error("Not updated")))
        }
    }

    def create(
        email: String,
        password: String,
        salt: String
    ): Future[Either[Error, User]] = {
      val action =
        (users returning users.map(_.id)
          into ((user, id) => user.copy(id = id))) += User(
          0,
          email,
          password,
          salt,
          None,
          DateTime.now()
        )

      db.run(action.asTry)
        .map(DBSerializers.toResult(u => Some(u)))
    }
  }

  lazy val userDataModel = UserDataModel
}
