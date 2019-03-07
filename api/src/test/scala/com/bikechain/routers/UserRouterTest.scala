package com.bikechain.routers

import akka.http.scaladsl.testkit.ScalatestRouteTest
import akka.http.scaladsl.model.StatusCodes
import com.bikechain.controllers.UserController
import com.bikechain.models.{SignUpBody, LoginBody, APIUser, EmptyResponse}
import com.bikechain.utils.WiroSupport
import de.heikoseeberger.akkahttpcirce.ErrorAccumulatingCirceSupport._
import org.scalatest.{FlatSpec, Matchers}
import wiro.server.akkaHttp._
import wiro.server.akkaHttp.FailSupport._
import wiro.Auth
import akka.http.scaladsl.model.{HttpEntity}
import akka.http.scaladsl.model.headers.{RawHeader}
import scala.util.Try
import com.bikechain.utils.{HashUtil}

class UserRouterTest extends RouterTest with Matchers {

  val userEmail = s"${HashUtil.randomAlphanumericString(10)}@bikechain.com"

  it should "Sign up a user with a wrong mail" in {
    Post(
      "/users/signUp",
      SignUpBody("wrongmail.com", "password", "password")
    ) ~> usersRoutes ~> check {
      status shouldBe StatusCodes.UnprocessableEntity
    }
  }

  it should "Sign up a user" in {
    Post(
      "/users/signUp",
      SignUpBody(userEmail, "password", "password")
    ) ~> usersRoutes ~> check {
      status shouldBe StatusCodes.OK
      responseAs[APIUser].email shouldBe userEmail
    }
  }

  it should "Login a user" in {
    Post("/users/login", LoginBody(userEmail, password)) ~> usersRoutes ~> check {
      status shouldEqual StatusCodes.OK
      responseAs[Auth].token shouldBe a[String]
      token = responseAs[Auth].token
    }
  }

  it should "Get a user by a token" in {
    Get("/users/me") ~> addAuthorizationHeader(token) ~> usersRoutes ~> check {
      status shouldEqual StatusCodes.OK
      val res = responseAs[APIUser]
      res shouldBe a[APIUser]
      res.email shouldEqual userEmail
    }
  }

  it should "Logout a user by token" in {
    Post("/users/logout", {}) ~> addAuthorizationHeader(token) ~> usersRoutes ~> check {
      status shouldEqual StatusCodes.OK
    }
  }
}
