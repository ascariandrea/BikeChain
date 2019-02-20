package com.bikechain.controllers

import wiro.Auth
import com.bikechain.config.BikeChainConfig
import com.bikechain.data.{DBConfig, Db, DeviceDataModel, UserDataModel}
import com.bikechain.models.{Device, Error, User}
import com.bikechain.routers.DevicesAPI
import com.bikechain.utils.ErrorSerializers

import scala.concurrent.Future

class DeviceController()
    extends DevicesAPI
    with BikeChainConfig
    with DBConfig
    with Db
    with DeviceDataModel
    with UserDataModel {

  import scala.concurrent.ExecutionContext.Implicits.global

  override def getById(token: Auth, id: Int): Future[Either[Error, Device]] =
    deviceDataModel
      .getDeviceById(id)

  override def create(
      token: Auth,
      uuid: String,
      name: String
  ): Future[Either[Error, Device]] = {
    userDataModel.getMe(token.token).flatMap { result =>
      result match {
        case Right(u) => deviceDataModel.createDevice(uuid, name, u.id)
        case Left(e)  => Future(Left(e))
      }
    }
  }

  override def getMany(token: Auth): Future[Either[Error, List[Device]]] = {
    deviceDataModel.getMany()
  }

}
