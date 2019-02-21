package com.bikechain.data

import com.bikechain.models.{Device, Error}
import scala.concurrent.{Future, ExecutionContext}
import scala.util.{Failure, Success, Try}
import com.bikechain.data.utils.DBSerializers
import slick.driver.PostgresDriver.api._
import com.github.tototoshi.slick.PostgresJodaSupport._
import org.joda.time.DateTime

trait DeviceDataModel {
  db: Db =>

  import scala.concurrent.ExecutionContext.Implicits.global

  class Devices(tag: Tag)
      extends Table[Device](tag, "devices")
      with TableWithCreateTimestamp {
    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def uuid = column[String]("uuid", O.Unique)

    def name = column[String]("name")

    def userId = column[Int]("user_id")

    def * =
      (id, uuid, name, userId, createdAt) <> (Device.tupled, Device.unapply)
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
      val action = devices returning devices.map(_.id) into (
          (
              item,
              id
          ) => item.copy(id = id)
      ) += Device(0, uuid, name, userId, DateTime.now())

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
