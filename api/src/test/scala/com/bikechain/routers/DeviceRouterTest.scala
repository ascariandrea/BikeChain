package com.bikechain.routers

import akka.http.scaladsl.testkit.ScalatestRouteTest
import akka.http.scaladsl.model.StatusCodes
import com.bikechain.controllers.DeviceController
import com.bikechain.models.{APIDevice, CreateDeviceBody, LoginBody}
import com.bikechain.utils.WiroSupport
import de.heikoseeberger.akkahttpcirce.ErrorAccumulatingCirceSupport._
import org.scalatest.{FlatSpec, Matchers}
import wiro.server.akkaHttp._
import wiro.server.akkaHttp.FailSupport._
import wiro.Auth
import akka.http.scaladsl.model.{HttpEntity}
import akka.http.scaladsl.model.headers.{RawHeader}
import scala.util.Try
import com.bikechain.utils.HashUtil

class DeviceRouterTest extends RouterTest with Matchers {

  var device: APIDevice = null
  val deviceUUID = HashUtil.randomAlphanumericString(10)
  val deviceName = s"Device - $deviceUUID"

  it should "Retrieve a valid token" in {
    Post("/users/login", LoginBody(email, password)) ~> usersRoutes ~> check {
      status shouldEqual StatusCodes.OK
      responseAs[Auth].token shouldBe a[String]
      token = responseAs[Auth].token
    }
  }

  it should "Create a device" in {
    Post(
      "/devices/create",
      CreateDeviceBody(deviceUUID, deviceName)
    ) ~> addHeader("Authorization", s"Token token=$token") ~> deviceRoutes ~> check {
      status shouldBe StatusCodes.OK
      device = responseAs[APIDevice]
      device.uuid shouldBe deviceUUID
      device.name shouldBe deviceName
    }
  }

  it should "Get all devices" in {
    Get("/devices/getMany") ~> addHeader("Authorization", s"Token token=$token") ~> deviceRoutes ~> check {
      status shouldBe StatusCodes.OK
      responseAs[List[APIDevice]] shouldBe a[List[_]]
    }
  }

  it should "Get a device by id" in {
    Get(s"/devices/getById?id=${device.id}") ~> addHeader(
      "Authorization",
      s"Token token=$token"
    ) ~> deviceRoutes ~> check {
      status shouldBe StatusCodes.OK
      responseAs[APIDevice].id shouldBe device.id
    }
  }

}
