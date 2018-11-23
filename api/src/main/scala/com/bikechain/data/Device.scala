package com.bikechain.data

import com.bikechain.models.Device
import scala.concurrent.{Future, ExecutionContext}

trait DeviceDataModel {
  db: Db =>

  import com.bikechain.core.PostgresProfile.api._
  import scala.concurrent.ExecutionContext.Implicits.global

  class Devices(tag: Tag) extends Table[Device](tag, "devices") {
    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def uuid = column[String]("uuid")

    def name = column[String]("name")

    def * = (id.?, uuid, name) <> (Device.tupled, Device.unapply)
  }

  val devices = TableQuery[Devices]

  object DeviceDataModel {
    def getDeviceById(id: Int): Future[Option[Device]] =
      db.dbConfig.db.run(devices.filter(_.id === id).result.headOption)

    def createDevice(uuid: String, name: String): Future[Device] = {
      val insertQuery = devices returning devices.map(_.id) into (
          (item,
           id) => item.copy(id = Some(id)))

      val action = insertQuery += Device(None, uuid, name)
      db.dbConfig.db.run(action)
    }

    def getMany(): Future[List[Device]] =
      db.dbConfig.db.run(devices.result).map(devicesSeq => devicesSeq.toList)
  }

  lazy val deviceDataModel = DeviceDataModel

}
