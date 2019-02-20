package com.bikechain.models

case class Device(
    id: Option[Int] = None,
    uuid: String,
    name: String,
    userId: Int
)
