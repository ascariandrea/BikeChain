package com.bikechain.data

import com.bikechain.core.PostgresProfile
import slick.basic.DatabaseConfig

trait Db {
  val dbConfig: DatabaseConfig[PostgresProfile]
  val db: PostgresProfile#Backend#Database = dbConfig.db
}
