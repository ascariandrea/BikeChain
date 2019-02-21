package com.bikechain.data

import com.bikechain.models.{SignUpBody, Error, User}
import com.bikechain.data.utils.DBSerializers
import com.bikechain.utils.{ErrorSerializers, HashUtil}
import scala.concurrent.Future
import slick.driver.PostgresDriver.api._
import com.github.tototoshi.slick.PostgresJodaSupport._
import org.joda.time.DateTime
import wiro.Auth

trait UserDataModel {
  db: Db =>

  import scala.concurrent.ExecutionContext.Implicits.global

  class Users(tag: Tag)
      extends Table[User](tag, "users")
      with TableWithCreateTimestamp {

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
      db.dbConfig.db
        .run(users.filter(_.token === token).result.asTry)
        .map(DBSerializers.toResult(r => r.headOption))

    def findByEmail(email: String): Future[Either[Error, User]] =
      db.dbConfig.db
        .run(users.filter(_.email === email).result.asTry)
        .map(DBSerializers.toResult(r => r.headOption))

    def updateToken(
        email: String,
        token: String
    ): Future[Either[Error, Auth]] = {
      db.dbConfig.db
        .run(
          users
            .filter(
              u => u.email === email
            )
            .map(u => u.token)
            .update(Some(token))
        )
        .flatMap {
          case 0 => Future(Left(Error("Not updated")))
          case _ =>
            db.dbConfig.db
              .run(users.filter(_.token === token).result.asTry)
              .map(
                DBSerializers
                  .toResult(
                    u => u.headOption.flatMap(u => u.token.map(t => Auth(t)))
                  )
              )

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

      db.dbConfig.db
        .run(action.asTry)
        .map(DBSerializers.toResult(u => Some(u)))
    }
  }

  lazy val userDataModel = UserDataModel
}
