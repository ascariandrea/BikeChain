package com.bikechain.controllers

import wiro.Auth
import com.bikechain.config.BikeChainConfig
import com.bikechain.data.{Db, DeviceDataModel, UserDataModel}
import com.bikechain.models.{APIDevice, Error, User}
import com.bikechain.routers.DevicesAPI
import com.bikechain.utils.ErrorSerializers
import slick.basic.DatabaseConfig
import scala.concurrent.Future
import com.bikechain.core.PostgresProfile
import slick.basic.DatabaseConfig

class DeviceController(val dbConfig: DatabaseConfig[PostgresProfile])
    extends DevicesAPI
    with BikeChainConfig
    with Db
    with DeviceDataModel
    with UserDataModel {

  import scala.concurrent.ExecutionContext.Implicits.global

  override def getById(token: Auth, id: Int): Future[Either[Error, APIDevice]] =
    deviceDataModel
      .getDeviceById(id)
      .map(result => result.map(APIDevice.fromDevice))

  override def create(
      token: Auth,
      uuid: String,
      name: String
  ): Future[Either[Error, APIDevice]] = {
    userDataModel.getMe(token.token).flatMap { result =>
      result match {
        case Right(u) =>
          deviceDataModel
            .createDevice(uuid, name, u.id)
            .map(result => result.map(APIDevice.fromDevice))
        case Left(e) => Future(Left(e))
      }
    }
  }

  override def getMany(token: Auth): Future[Either[Error, List[APIDevice]]] = {
    deviceDataModel
      .getMany()
      .map(r => r.map(devices => devices.map(APIDevice.fromDevice)))
  }

}
