package com.bikechain.data

import org.joda.time.DateTime
import com.bikechain.core.PostgresProfile.api._
import com.github.tototoshi.slick.PostgresJodaSupport._

trait CreatedAtColumn { self: Table[_] =>

  def createdAt =
    column[DateTime](
      "created_at",
      O.SqlType("timestamp default now()")
    )
}
