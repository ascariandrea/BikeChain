package com.bikechain.models

import org.joda.time.DateTime

case class Device(
    id: Int,
    uuid: String,
    name: String,
    userId: Int,
    createdAt: DateTime
)

case class APIDevice(
    id: Int,
    uuid: String,
    name: String,
    userId: Int,
    createdAt: String
)

object APIDevice {
  def fromDevice(d: Device): APIDevice =
    APIDevice(
      id = d.id,
      uuid = d.uuid,
      name = d.name,
      userId = d.userId,
      createdAt = d.createdAt.toString
    )
}

case class CreateDeviceBody(uuid: String, name: String)
