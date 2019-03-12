package com.bikechain.data.utils

import scala.util.{Failure, Success, Try}
import org.postgresql.util.PSQLException
import com.bikechain.models.Error

object DBSerializers {
  def toResult[T, U](f: T => Option[U])(resultTry: Try[T]): Either[Error, U] =
    resultTry match {
      case Failure(e: PSQLException) => Left(Error(e.getMessage))
      case Failure(e: Exception)     => Left(Error(e.getMessage))
      case Failure(e)                => Left(Error("Error"))
      case Success(r) =>
        f(r) match {
          case None    => Left(Error("couldn't find the resource", 404))
          case Some(a) => Right(a)

        }
    }
}
