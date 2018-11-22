package com.bikechain.data

import com.bikechain.core.PostgresProfile
import slick.basic.DatabaseConfig

trait DBConfig {
  lazy val dbConfig = DatabaseConfig.forConfig[PostgresProfile]("bikechain.pgsql")
}

trait Db {
  val dbConfig: DatabaseConfig[PostgresProfile]
}
