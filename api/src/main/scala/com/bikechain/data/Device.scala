package com.bikechain.data

import com.bikechain.models.{Device, DeviceStatus, Error}
import scala.concurrent.{Future, ExecutionContext}
import scala.util.{Failure, Success, Try}
import com.bikechain.data.utils.DBSerializers
import com.github.tototoshi.slick.PostgresJodaSupport._
import com.bikechain.core.PostgresProfile.api._
import org.joda.time.DateTime

trait DeviceDataModel {
  this: Db =>

  import scala.concurrent.ExecutionContext.Implicits.global

  class Devices(tag: Tag)
      extends Table[Device](tag, "devices")
      with CreatedAtColumn {

    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def uuid = column[String]("uuid", O.Unique)

    def name = column[String]("name")

    def status =
      column[DeviceStatus]("status", O.Default(DeviceStatus.Ok))

    def userId = column[Int]("user_id")

    def * =
      (id, uuid, name, userId, status, createdAt) <> (Device.tupled, Device.unapply)
  }

  val devices = TableQuery[Devices]

  object DeviceDataModel {

    def getDeviceById(id: Int): Future[Either[Error, Device]] =
      db.run(devices.filter(_.id === id).result.asTry)
        .map(DBSerializers.toResult(r => r.headOption))

    def createDevice(
        uuid: String,
        name: String,
        userId: Int
    ): Future[Either[Error, Device]] = {
      val action = devices returning devices.map(_.id) into (
          (
              item,
              id
          ) => item.copy(id = id)
      ) += Device(0, uuid, name, userId, DeviceStatus.Ok, DateTime.now())

      db.run(action.asTry)
        .map(DBSerializers.toResult(d => Some(d)))
    }

    def getMany(): Future[Either[Error, List[Device]]] =
      db.run(devices.result.asTry)
        .map(DBSerializers.toResult(d => Some(d.toList)))
  }

  lazy val deviceDataModel = DeviceDataModel

}
