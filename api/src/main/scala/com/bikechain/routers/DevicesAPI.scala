package com.bikechain.routers

import wiro.Auth
import wiro.annotation.{command, path, query}
import com.bikechain.models.{Error, APIDevice}

import scala.concurrent.Future

@path("devices")
trait DevicesAPI {

  @query
  def getMany(token: Auth): Future[Either[Error, List[APIDevice]]]

  @query
  def getById(token: Auth, id: Int): Future[Either[Error, APIDevice]]

  @command
  def create(
      token: Auth,
      uuid: String,
      name: String
  ): Future[Either[Error, APIDevice]]
}
