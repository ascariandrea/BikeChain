package com.bikechain.data

import org.joda.time.DateTime
import slick.driver.PostgresDriver.api._
import com.github.tototoshi.slick.PostgresJodaSupport._

trait TableWithCreateTimestamp { self: Table[_] =>

  def createdAt =
    column[DateTime](
      "created_at",
      O.SqlType("timestamp default now()")
    )
}
