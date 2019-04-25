package com.bikechain.data

import spray.json._
import com.bikechain.models.{DeviceStatus}
import io.buildo.enumero.{CaseEnum, CaseEnumSerialization}
import scala.reflect.ClassTag
import com.bikechain.core.PostgresProfile.api._

trait JSONProtocolWithEnum {

  implicit def caseEnumMapper[A <: CaseEnum: ClassTag](
      implicit ev: CaseEnumSerialization[A]
  ) =
    MappedColumnType.base[A, String](
      p => ev.caseToString(p),
      s => ev.caseFromString(s).get
    )

  def caseEnumJsonFormat[T <: CaseEnum](
      implicit caseEnumSerialization: CaseEnumSerialization[T]
  ) = new JsonFormat[T] {
    def write(value: T) = JsString(caseEnumSerialization.caseToString(value))
    def read(jsvalue: JsValue) = jsvalue match {
      case JsString(str) =>
        caseEnumSerialization.caseFromString(str).getOrElse {
          deserializationError(s"$str is not a valid enum value")
        }
      case x => deserializationError(s"Expected JsString, got $x")
    }
  }

  implicit val DeviceStatusFormat = caseEnumJsonFormat[DeviceStatus]
}
