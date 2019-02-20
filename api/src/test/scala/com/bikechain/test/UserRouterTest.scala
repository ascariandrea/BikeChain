package com.bikechain.test

import akka.http.scaladsl.testkit.ScalatestRouteTest
import akka.http.scaladsl.model.StatusCodes
import com.bikechain.controllers.UserController
import com.bikechain.models.{SignUpBody, LoginBody, APIUser}
import com.bikechain.routers.UsersAPI
import com.bikechain.utils.WiroSupport
import de.heikoseeberger.akkahttpcirce.ErrorAccumulatingCirceSupport._
import org.scalatest.{FlatSpec, Matchers}
import wiro.server.akkaHttp._
import wiro.server.akkaHttp.FailSupport._
import wiro.Auth
import akka.http.scaladsl.model.{HttpEntity}
import akka.http.scaladsl.model.headers.{RawHeader}
import scala.util.Try

// final class ApiTokenHeader(token: String)
//     extends ModeledCustomHeader[ApiTokenHeader] {
//   override def renderInRequests = true
//   override def renderInResponses = true
//   override val companion = ApiTokenHeader
//   override def value: String = token
// }
// object ApiTokenHeader extends ModeledCustomHeaderCompanion[ApiTokenHeader] {
//   override val name = "Authorization"
//   override def parse(value: String) =
//     Try(new ApiTokenHeader(s"Token token=$value"))
// }

class UserRouterTest
    extends FlatSpec
    with Matchers
    with ScalatestRouteTest
    with WiroSupport
    with RouterDerivationModule {

  var token: String
  val route = deriveRouter[UsersAPI](new UserController).buildRoute

  it should "Sign up a user" in {
    Post(
      "/users/signUp",
      SignUpBody("me@bikechain.com", "password", "password")
    ) ~> route ~> check {
      status shouldBe StatusCodes.OK
      responseAs[APIUser].email shouldBe "me@bikechain.com"
    }
  }

  it should "Login a user" in {
    Post("/users/login", LoginBody("me@bikechain.com", "password")) ~> route ~> check {
      status shouldEqual StatusCodes.OK
      responseAs[Auth].token shouldBe a[String]
      token = responseAs[Auth].token
    }
  }

  it should "Get a user by a token" in {
    Get("/users/me", RawHeader("Authorization", s"Token token=$token")) ~> route ~> check {
      status shouldEqual StatusCodes.OK
      responseAs[APIUser] shouldBe a[APIUser]
    }
  }
}
