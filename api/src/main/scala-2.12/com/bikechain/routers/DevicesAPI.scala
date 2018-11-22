package com.bikechain.routers

import wiro.annotation.{command, path, query}
import com.bikechain.models.{Error, NotFoundError, Device}

import scala.concurrent.Future

@path("devices")
trait DevicesAPI {

  @query
  def getMany(): Future[Either[Error, List[Device]]]

  @query
  def getById(id: Int): Future[Either[NotFoundError, Device]]

  @command
  def create(uuid: String, name: String): Future[Either[Error, Device]]
}
