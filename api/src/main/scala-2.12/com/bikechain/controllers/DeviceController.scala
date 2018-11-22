package com.bikechain.controllers
import com.bikechain.config.BikeChainConfig
import com.bikechain.models.{Device, Error, NotFoundError}
import com.bikechain.data.{DBConfig, Db, DeviceDataModel}
import com.bikechain.routers.DevicesAPI

import scala.concurrent.Future

class DeviceController()
    extends DevicesAPI
    with BikeChainConfig
    with DBConfig
    with Db
    with DeviceDataModel {

  // import scala.concurrent.ExecutionContext.Implicits.global

  override def getById(id: Int): Future[Either[NotFoundError, Device]] =
    deviceDataModel
      .getDeviceById(id)
      .map(
        optD =>
          optD.fold[Either[NotFoundError, Device]](
            Left(NotFoundError(s"Can't find a device with the given id: $id")))(
            Right.apply))

  override def create(uuid: String,
                      name: String): Future[Either[Error, Device]] =
    deviceDataModel.createDevice(uuid, name).map(device => Right(device))

  override def getMany(): Future[Either[Error, List[Device]]] =
    deviceDataModel.getMany().map(devices => Right(devices))
}
