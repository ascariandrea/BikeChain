package com.bikechain.utils

import com.bikechain.models.{Error}

object ErrorSerializers {

  def NOT_FOUND_CODE = 404;

  def toUnauthorizedError(): Error = Error(s"The user is not authorized", 401);

  def toNotFoundError(resource: String, byKey: String, byValue: String): Error =
    Error(
      s"Can't find the resource $resource by the given value $byValue for key $byKey",
      404
    )

  def toInvalidParamError(paramKey: String, param: String): Error =
    Error(
      s"$paramKey must be valid: $param",
      422
    )
}
