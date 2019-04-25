package com.bikechain.core

import com.github.tminglei.slickpg._
import slick.jdbc.{JdbcType}
import slick.jdbc.PostgresProfile.api._
import com.bikechain.models.{DeviceStatus}
import io.buildo.enumero.{CaseEnum, CaseEnumSerialization}
import scala.reflect.ClassTag

trait PostgresProfile
    extends ExPostgresProfile
    with PgArraySupport
    with PgDate2Support
    with PgRangeSupport
    with PgHStoreSupport
    with PgJsonSupport
    with PgSearchSupport
    with PgNetSupport
    with PgLTreeSupport
    with PgEnumSupport {

  // jsonb support is in postgres 9.4.0 onward; for 9.3.x use "json"
  def pgjson = "jsonb"
  override val api = MyAPI

  object MyAPI
      extends API
      with ArrayImplicits
      with DateTimeImplicits
      with JsonImplicits
      with NetImplicits
      with LTreeImplicits
      with RangeImplicits
      with HStoreImplicits
      with SearchImplicits
      with SearchAssistants {

    implicit val deviceStatusEnumSerialization =
      implicitly[CaseEnumSerialization[DeviceStatus]]

    implicit lazy val deviceStatusCaseEnumMapper =
      createEnumJdbcType[DeviceStatus](
        "status",
        deviceStatusEnumSerialization.caseToString(_),
        deviceStatusEnumSerialization
          .caseFromString(_)
          .get,
        quoteName = false
      )

    implicit val deviceStatusListTypeMapper: JdbcType[List[DeviceStatus]] =
      new AdvancedArrayJdbcType[DeviceStatus](
        "status",
        (s) => Seq(deviceStatusEnumSerialization.caseFromString(s).get),
        s => {
          utils.SimpleArrayUtils.mkString[DeviceStatus](
            deviceStatusEnumSerialization.caseToString
          )(s)
        }
      ).to(_.toList)

    implicit val deviceStatusColumnExtensionMethodsBuilder =
      createEnumColumnExtensionMethodsBuilder[DeviceStatus]
  }
}

object PostgresProfile extends PostgresProfile
