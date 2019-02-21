package com.bikechain.routers

import com.bikechain.controllers.{UserController, DeviceController}
import wiro.server.akkaHttp._
import wiro.server.akkaHttp.FailSupport._
import com.bikechain.utils.WiroSupport

trait RouterTest extends WiroSupport with RouterDerivationModule {

  import scala.concurrent.ExecutionContext.Implicits.global

  val email = "me@bikechain.com"
  val password = "password"

  var token: String = null

  val usersRoutes = deriveRouter[UsersAPI](new UserController).buildRoute
  val deviceRoutes = deriveRouter[DevicesAPI](new DeviceController).buildRoute
}
