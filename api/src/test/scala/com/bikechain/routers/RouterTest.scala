package com.bikechain.routers

import com.bikechain.controllers.{UserController, DeviceController}
import wiro.server.akkaHttp._
import wiro.server.akkaHttp.FailSupport._
import com.bikechain.utils.WiroSupport
import org.scalatest.{BeforeAndAfterAll, FlatSpec}
import akka.http.scaladsl.testkit.ScalatestRouteTest
import com.bikechain.models.{SignUpBody}
import akka.http.scaladsl.model.{HttpEntity}
import com.bikechain.data.{Db, DbConfiguration}
import com.bikechain.core.PostgresProfile.api._
import com.bikechain.utils.{HashUtil}
import scala.util.{Failure, Success}
import wiro.Auth

trait RouterTest
    extends FlatSpec
    with WiroSupport
    with RouterDerivationModule
    with BeforeAndAfterAll
    with ScalatestRouteTest
    with Db
    with DbConfiguration {

  import scala.concurrent.ExecutionContext.Implicits.global

  val email = "me@bikechain.com"
  val password = "password"

  var token: String = null

  override def beforeAll() {
    val salt = HashUtil.randomAlphanumericString(64)
    val passwordHash =
      HashUtil.saltAndHash(password, salt)

    token = HashUtil.randomAlphanumericString(24)

    val statement =
      sqlu"""
        INSERT INTO users (email, password, salt, token)
        VALUES ($email, $passwordHash, $salt, $token)
        ON CONFLICT (email)
        DO UPDATE SET password = $passwordHash, salt = $salt, token = $token;
      """

    dbConfig.db.run(statement.asTry)
  }

  def addAuthorizationHeader(token: String) =
    addHeader("Authorization", s"Token token=$token")

  val usersRoutes =
    deriveRouter[UsersAPI](new UserController(dbConfig)).buildRoute
  val deviceRoutes =
    deriveRouter[DevicesAPI](new DeviceController(dbConfig)).buildRoute
}
