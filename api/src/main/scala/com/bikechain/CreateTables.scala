package com.bikechain
import com.bikechain.config.BikeChainConfig
import com.bikechain.data.{DBConfig, Db, DeviceDataModel, UserDataModel}
import slick.jdbc.meta.MTable

import scala.concurrent.{Await, ExecutionContext}
import scala.concurrent.duration.Duration

object CreateTables
    extends DeviceDataModel
    with UserDataModel
    with BikeChainConfig
    with Db
    with DBConfig {

  import com.bikechain.core.PostgresProfile.api._
  implicit val ec: ExecutionContext = scala.concurrent.ExecutionContext.global

  lazy val tables = List(
    users,
    devices
  )

  def createIfNotExist(): List[Unit] = {
    val existing = dbConfig.db.run(MTable.getTables)
    val f = existing.flatMap(v => {
      val names = v.map(mt => mt.name.name)
      val createIfNotExist = tables
        .filter(table => !names.contains(table.baseTableRow.tableName))
        .map(_.schema.create)
      dbConfig.db.run(DBIO.sequence(createIfNotExist))
    })
    Await.result(f, Duration.Inf)
  }

}
