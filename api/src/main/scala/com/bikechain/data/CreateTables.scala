package com.bikechain.data

import com.bikechain.config.BikeChainConfig
import slick.jdbc.meta.MTable
import scala.concurrent.{Await, ExecutionContext}
import scala.concurrent.duration.Duration
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

object CreateTables
    extends App
    with BikeChainConfig
    with DbConfiguration
    with Db
    with DeviceDataModel
    with UserDataModel {

  final val logger: Logger = LoggerFactory.getLogger(CreateTables.getClass)

  import com.bikechain.core.PostgresProfile.api._
  implicit val ec: ExecutionContext = scala.concurrent.ExecutionContext.global

  lazy val tables = List(
    users,
    devices
  )

  def createIfNotExist(): List[Unit] = {
    val existing = this.db.run(MTable.getTables)
    val f = existing.flatMap(v => {
      val names = v.map(mt => mt.name.name)
      val createIfNotExist = tables
        .filter(table => !names.contains(table.baseTableRow.tableName))
        .map(t => {
          t.schema.create.statements.foreach(logger.info)
          t.schema.create
        })

      this.db.run(DBIO.sequence(createIfNotExist))
    })
    Await.result(f, Duration.Inf)
  }

  createIfNotExist()

}
