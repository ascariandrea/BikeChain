package com.bikechain.data

import com.bikechain.models.{Device, Error}
import scala.concurrent.{Future, ExecutionContext}
import scala.util.{Failure, Success, Try}
import com.bikechain.data.utils.DBSerializers

trait DeviceDataModel {
  db: Db =>

  import com.bikechain.core.PostgresProfile.api._
  import scala.concurrent.ExecutionContext.Implicits.global

  class Devices(tag: Tag) extends Table[Device](tag, "devices") {
    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def uuid = column[String]("uuid", O.Unique)

    def name = column[String]("name")

    def userId = column[Int]("user_id")

    def * = (id.?, uuid, name, userId) <> (Device.tupled, Device.unapply)
  }

  val devices = TableQuery[Devices]
  val devicesDB = db.dbConfig.db

  object DeviceDataModel {

    def getDeviceById(id: Int): Future[Either[Error, Device]] =
      devicesDB
        .run(devices.filter(_.id === id).result.asTry)
        .map(DBSerializers.toResult(r => r.headOption))

    def createDevice(
        uuid: String,
        name: String,
        userId: Int
    ): Future[Either[Error, Device]] = {
      val insertQuery = devices returning devices.map(_.id) into (
          (
              item,
              id
          ) => item.copy(id = Some(id))
      )

      val action = insertQuery += Device(None, uuid, name, userId)
      db.dbConfig.db
        .run(action.asTry)
        .map(DBSerializers.toResult(d => Some(d)))
    }

    def getMany(): Future[Either[Error, List[Device]]] =
      db.dbConfig.db
        .run(devices.result.asTry)
        .map(DBSerializers.toResult(d => Some(d.toList)))
  }

  lazy val deviceDataModel = DeviceDataModel

}
