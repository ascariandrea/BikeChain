package com.bikechain.data

import com.bikechain.core.PostgresProfile
import slick.basic.DatabaseConfig

trait DbConfiguration {
  lazy val dbConfig =
    DatabaseConfig.forConfig[PostgresProfile]("bikechain.pgsql")
}
